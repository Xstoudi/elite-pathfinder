import { useCallback, useEffect, useState } from 'react'
import useFetch from 'use-http'
import Card from '../components/Card'
import SearchForm from '../components/SearchForm'
import { SparklesIcon } from '@heroicons/react/outline'
import PathEntry from '../types/PathEntry'
import Journey from '../components/Journey'
import PathfindingResult from '../types/PathfindingResult'


export default function Main() {
  const [result, setResult] = useState<PathfindingResult | null>(null)
  const { post: pathfind, response, loading } = useFetch<PathfindingResult>(process.env.REACT_APP_API_URL)
  const runSearch = useCallback(async (source: string, destination: string, range: number) => {
    setResult(null)
    const result = await pathfind('/pathfinder', { from: source, to: destination, range })
    if(response.ok) {
      setResult(result)
    }
  }, [setResult, pathfind, response])

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
        result !== null && <Journey journey={result} />
      }
    </div>
  )
}