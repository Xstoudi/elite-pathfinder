import AStarOptions from 'Contracts/interfaces/AStarOptions'
import { expose } from 'threads/worker'

import Graph, { PathEntry } from '../GalaxyGraph'
import systems from '../systems'
import timer from '../timer'

const MAX_DEVIATION = 0.2

export interface PathfindingResult {
  vertexCount: number
  edgeCount: number
  path: PathEntry[]
  timings: {
    buildGraph: number
    findPath: number
  }
}

/**
 * Build a graph from the systems with the given options
 * @param payload AStarOptions
 * @returns
 */
function buildGraph(payload: AStarOptions): Graph {
  const { source, destination, rangeSquared } = payload

  const graph = new Graph()

  const birdDistance = graph.distanceSquared(source, destination)

  for (const system of systems) {
    if (graph.distanceSquared(system, destination) > birdDistance * (1 + MAX_DEVIATION) ** 2) {
      continue
    }
    graph.addVertex(system)
    for (const systemTo of systems) {
      if (graph.distanceSquared(systemTo, destination) > birdDistance * (1 + MAX_DEVIATION) ** 2) {
        continue
      }

      graph.addVertex(systemTo)
      if (system.id === systemTo.id) {
        continue
      }

      const distanceSquared =
        (system.x - systemTo.x) ** 2 + (system.y - systemTo.y) ** 2 + (system.z - systemTo.z) ** 2
      if (distanceSquared <= rangeSquared) {
        graph.addEdge(system, systemTo)
      }
    }
  }
  return graph
}

/**
 * A-Star algorithm function.
 * @note You probably want to run it in a separate thread.
 * @param payload AStarOptions
 * @returns PathfindingResult
 */
function aStarAlgorithm(payload: AStarOptions): PathfindingResult {
  const { source, destination } = payload
  const buildGraphTimer = timer()
  const graph = buildGraph(payload)
  buildGraphTimer.stop()

  const findPathTimer = timer()
  const path = graph.findPath(source, destination, (node) => {
    const fromSystem = node.getValue()
    return (
      (fromSystem.x - destination.x) ** 2 +
      (fromSystem.y - destination.y) ** 2 +
      (fromSystem.z - destination.z) ** 2
    )
  })
  findPathTimer.stop()

  return {
    vertexCount: graph.vertexCount,
    edgeCount: graph.edgeCount,
    path,
    timings: {
      buildGraph: buildGraphTimer.getTime(),
      findPath: findPathTimer.getTime(),
    },
  }
}

export type AStarAlgorithmFunction = typeof aStarAlgorithm

/**
 * Expose the pathfinding algorithm to the thread pool and export it.
 */
export default expose(aStarAlgorithm)
