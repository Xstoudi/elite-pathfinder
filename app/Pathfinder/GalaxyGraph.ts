import { MinQueue } from '@xstoudi/heapify'
import System from 'Contracts/interfaces/System'
import GalaxyNode from './GalaxyNode'

import Node from './GalaxyNode'

export interface PathEntry {
  system: System
  cost: number
}

const HEAP_CAPACITY = 1000000

/**
 * Graph class
 */
export default class GalaxyGraph {
  public static UNDIRECTED = Symbol('undirected graph')
  public static DIRECTED = Symbol('directed graph')

  private nodes: Map<number, Node> = new Map()
  private edgeDirection: Symbol

  public vertexCount = 0
  public edgeCount = 0

  constructor(edgeDirection = GalaxyGraph.DIRECTED) {
    this.nodes = new Map()
    this.edgeDirection = edgeDirection
  }

  public addEdge(source: System, destination: System) {
    const sourceNode = this.addVertex(source)
    const destinationNode = this.addVertex(destination)

    sourceNode.addAdjacent(destinationNode)

    if (this.edgeDirection === GalaxyGraph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode)
    }

    this.edgeCount++

    return [sourceNode, destinationNode]
  }

  public addVertex(value: System) {
    if (this.nodes.has(value.id)) {
      return this.nodes.get(value.id) as GalaxyNode
    } else {
      const vertex = new Node(value)
      this.nodes.set(value.id, vertex)
      this.vertexCount++
      return vertex
    }
  }

  public removeVertex(value: System) {
    const current = this.nodes.get(value.id)
    if (current) {
      for (const node of this.nodes.values()) {
        node.removeAdjacent(current)
      }
    }
    return this.nodes.delete(value.id)
  }

  public getNodes() {
    return [...this.nodes.values()]
  }

  public distanceSquared(a: System, b: System) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
  }

  public findPath(
    source: System,
    destination: System,
    distanceToDestination: (node: GalaxyNode) => number
  ): [PathEntry[], number] {
    const openList = new MinQueue(HEAP_CAPACITY)
    openList.push(source.id, 0)

    this.nodes.get(source.id)?.setCost(0)

    while (openList.size > 0) {
      const currentId = openList.pop() as number
      const current = this.nodes.get(currentId) as GalaxyNode // u
      if (currentId === destination.id) {
        const path: PathEntry[] = []
        let cameFrom: GalaxyNode | null = current
        while (cameFrom !== null) {
          path.push({ system: cameFrom.getValue(), cost: cameFrom.getCost() as number })
          cameFrom = cameFrom.getCameFrom()
        }
        return [path.reverse(), openList.size]
      }

      // v
      for (const adjacent of current.getAdjacents()) {
        const newCost =
          (current.getCost() || 0) +
          Math.sqrt(this.distanceSquared(current.getValue() as System, adjacent.getValue()))

        if (adjacent.getCost() === null || newCost < (adjacent.getCost() || 0)) {
          adjacent.setCost(newCost)
          adjacent.setCameFrom(current)
          openList.push(adjacent.getValue().id, newCost + distanceToDestination(adjacent))
        }
      }
    }
    throw new Error('Path not found')
  }
}
