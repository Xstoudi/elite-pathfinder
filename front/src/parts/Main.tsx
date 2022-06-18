import { useCallback, useState } from 'react'
import useFetch from 'use-http'
import Card from '../components/Card'
import SearchForm from '../components/SearchForm'
import { SparklesIcon } from '@heroicons/react/outline'
import Journey from '../components/Journey'
import PathfindingResult from '../types/PathfindingResult'
import ErrorReporting from '../components/ErrorReporting'


export default function Main() {
  const [result, setResult] = useState<PathfindingResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { post: pathfind, response, loading, error } = useFetch<PathfindingResult>(process.env.REACT_APP_API_URL)
  const runSearch = useCallback(async (source: string, destination: string, range: number) => {
    setErrorMessage(null)
    setResult(null)
    const result = await pathfind('/pathfinder', { from: source, to: destination, range })
    if(response.ok) {
      setResult(result)
    } else {
      setErrorMessage((result as any).error)
    }
  }, [setResult, pathfind, response])
  console.log(error, result)

  return (
    <div className='flex flex-col mx-auto items-center'>
      <SearchForm runSearch={runSearch} isSearching={loading} />
      {
        loading && <Card title='Searching...'>
          <div className='w-full flex justify-center'>
            <SparklesIcon className='h-20 w-20 text-blue-500 animate-pulse' />
          </div>
        </Card>
      }
      {
        result !== null && <Journey journey={result} />
      }
      {
        errorMessage && <ErrorReporting message={errorMessage} />
      }
    </div>
  )
}