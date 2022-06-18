import prettyMilliseconds from 'pretty-ms'
import PathfindingResult from '../types/PathfindingResult'

interface StatsProps {
    stats: PathfindingResult['stats'] & { jumps: number, distance: number }
}

export default function Stats({ stats }: StatsProps) {
  const { jumps, distance, timings: { buildGraph, findPath }, vertexCount, edgeCount } = stats
  return (
    <div className='stats stats-vertical lg:stats-horizontal shadow'>
      <div className='stat'>
        <div className='stat-title'>Distance</div>
        <div className='stat-value'>{distance.toFixed(2)} ly</div>
        <div className='stat-desc'>{(distance / jumps).toFixed(2)} ly per jump</div>
      </div>
      <div className='stat'>
        <div className='stat-title'>Jumps</div>
        <div className='stat-value'>{jumps}</div>
        <div className='stat-desc'>~{prettyMilliseconds(jumps * 40 * 1000)}</div>
      </div>

      <div className='stat'>
        <div className='stat-title'>Build graph</div>
        <div className='stat-value'>{prettyMilliseconds(buildGraph)}</div>
        <div className='stat-desc'>plus {findPath}ms to find path</div>
      </div>
  
      <div className='stat'>
        <div className='stat-title'>Graph vertex</div>
        <div className='stat-value'>{vertexCount.toLocaleString()}</div>
        <div className='stat-desc'>(systems)</div>
      </div>

      <div className='stat'>
        <div className='stat-title'>Edge</div>
        <div className='stat-value'>{(edgeCount/2).toLocaleString()}</div>
        <div className='stat-desc'>bidirectional!</div>
      </div>
  
    </div>
  )
}