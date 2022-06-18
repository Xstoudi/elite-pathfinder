import { useCallback, useEffect, useState } from 'react'
import PathfindingResult from '../types/PathfindingResult'
import Card from './Card'
import Stats from './Stats'

const Copied = () => <kbd className='kbd'>Copied!</kbd>

interface JourneyProps {
  journey: PathfindingResult
}

export default function Journey({ journey: { path, stats } }: JourneyProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback((content: string) => {
    setCopied(true)
    window.navigator.clipboard.writeText(content)
  }, [])
  
  
  useEffect(() => {
    if(copied === true){
      setTimeout(() => setCopied(false), 3000)
    }
  }, [copied, setCopied])

  if(path.length === 0) {
    return <></>
  }

  return (
    <Card title='Journey log' rightTitle={copied && <Copied />}>
      <div className='overflow-x-auto'>
        <Stats stats={{...stats, jumps: path.length - 1, distance: path[path.length - 1].cost}} />
        <table className='table w-full mt-4'>
          <thead>
            <tr>
              <th></th>
              <th>System</th>
              <th>Distance</th>
              <th>Total distance</th>
            </tr>
          </thead>
          <tbody>
            {
              path.map(({ system, cost }, index) =>  
                (
                  <tr key={index} onClick={() => copyToClipboard(system.name)}>  
                    <td>{index + 1}</td>
                    <td>{system.name}</td>
                    <td>
                      {
                        (index === 0 ? 0 : cost - path[index - 1].cost).toFixed(2)
                      } ly
                    </td>
                    <td>{cost.toFixed(2)} ly</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    </Card>
  )
}