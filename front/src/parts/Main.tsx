import { useCallback, useEffect, useState } from 'react'
import useFetch from 'use-http'
import Card from '../components/Card'
import SearchForm from '../components/SearchForm'
import { SparklesIcon } from '@heroicons/react/outline'
import useTimeout from '../hooks/useTimeout'

interface PathEntry {
  system: {
    name: string
  },
  cost: number
}

const Copied = () => <kbd className='kbd'>Copied!</kbd>

export default function Main() {
  const [path, setPath] = useState<PathEntry[]>([])
  const { post: pathfind, response, loading } = useFetch(process.env.REACT_APP_API_URL)
  const runSearch = useCallback(async (source: string, destination: string, range: number) => {
    setPath([])
    const { path } = await pathfind('/pathfinder', { from: source, to: destination, range })
    if(response.ok) setPath(path)
  }, [setPath, pathfind, response])

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

  return (
    <div className='flex flex-col mx-auto items-center'>
      <SearchForm runSearch={runSearch} isSearching={loading} />
      {
        loading && <Card title='Searching...'>
          <div className='w-full flex justify-center'>
            <SparklesIcon className='h-10 w-10 text-blue-500 animate-pulse' />
          </div>
        </Card>
      }
      {
        path.length > 0 && <Card title='Journey log' rightTitle={copied && <Copied />}>
          <div className='overflow-x-auto'>
            <table className='table w-full'>
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
                          }
                        </td>
                        <td>{cost.toFixed(2)}</td>
                      </tr>
                    )
                  )
                }
              </tbody>
            </table>
          </div>

        </Card>
      }
    </div>
  )
}