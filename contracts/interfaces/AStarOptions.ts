import System from './System'

export default interface AStarOptions {
  source: System
  destination: System
  rangeSquared: number
}
