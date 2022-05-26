import { spawn, Thread, Worker } from 'threads'
import { join } from 'path'
import AStarOptions from 'Contracts/interfaces/AStarOptions'
import { AStarAlgorithmFunction } from './workers/pathfinder.worker'

/**
 * Asynchronously run the aStar algorithm in a separate thread.
 * @param options AStarOptions
 * @returns PathfindingResult
 */
export default async function runPathfinder(options: AStarOptions) {
  const aStarAlgorithm = await spawn<AStarAlgorithmFunction>(
    new Worker(join('workers', 'pathfinder.worker.ts'))
  )
  const result = await aStarAlgorithm(options)
  await Thread.terminate(aStarAlgorithm)
  return result
}
