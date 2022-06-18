import PathEntry from './PathEntry'

export default interface PathfindingResult {
    path: PathEntry[]
    stats: {
      vertexCount: number
      edgeCount: number
      heapSize: number
      timings: {
        buildGraph: number
        findPath: number
      }
    }
  }