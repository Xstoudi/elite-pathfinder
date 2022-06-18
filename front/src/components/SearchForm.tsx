import { useCallback, useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import Card from './Card'

interface SearchFormProps {
  runSearch: (source: string, destination: string, range: number) => void
  isSearching: boolean
}

export default function SearchForm({runSearch, isSearching}: SearchFormProps) {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [range, setRange] = useState(20)

  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([])

  const debouncedSource = useDebounce<string>(source, 100)
  const debouncedDestination = useDebounce<string>(destination, 100)

  useEffect(() => {
    if(debouncedSource && debouncedSource.length >= 3) {
      fetch(`${process.env.REACT_APP_API_URL}/system?query=${debouncedSource}`)
        .then(res => res.json())
        .then(data => setSourceSuggestions(data.systems))
    } else {
      setSourceSuggestions([])
    }
  }, [debouncedSource])

  useEffect(() => {
    if(debouncedDestination && debouncedDestination.length >= 3) {
      fetch(`${process.env.REACT_APP_API_URL}/system?query=${debouncedDestination}`)
        .then(res => res.json())
        .then(data => setDestinationSuggestions(data.systems))
    } else {
      setDestinationSuggestions([])
    }
  }, [debouncedDestination])

  const clickSourceSuggestion = useCallback((name: string) => {
    setSource(name)
    setSourceSuggestions([])
  }, [])

  const clickDestinationSuggestion = useCallback((name: string) => {
    setDestination(name)
    setDestinationSuggestions([])
  }, [])

  const handleSubmit = useCallback(() => {
    runSearch(source, destination, range)
  }, [runSearch, source, destination, range])
  
  return (
    <Card title='Search'>
      <div className='flex flex-row w-full place-content-between flex-wrap'>
        <div className='form-control px-2 w-1/2 lg:w-1/3 relative'>
          <label className='label'>
            <span className='label-text'>Source system</span>
          </label>
          <div className='input-group'>
            <span>SRC</span>
            <input type='text' placeholder='Sol' value={source} onChange={e => setSource(e.target.value)} className='input input-bordered w-full' />
          </div>
          {
            sourceSuggestions.length > 1 && !sourceSuggestions.includes(debouncedSource) && (
              <ul className='absolute top-full w-full'>
                {
                  sourceSuggestions.map((system) => (
                    <li className='border-b px-4 py-2' key={system} onClick={() => clickSourceSuggestion(system)}>
                      {system}
                    </li>
                  ))
                }
              </ul>
            )
          }
        </div>
        <div className='form-control px-2 w-1/2 lg:w-1/3 relative'>
          <label className='label'>
            <span className='label-text'>Destination system</span>
          </label>
          <label className='input-group'>
            <span>DEST</span>
            <input type='text' placeholder='Sol' value={destination} onChange={e => setDestination(e.target.value)} className='input input-bordered w-full' />
          </label>
          {
            destinationSuggestions.length > 1 && !destinationSuggestions.includes(debouncedDestination) && (
              <ul className='absolute top-full w-full'>
                {
                  destinationSuggestions.map(system => (
                    <li className='border-b px-4 py-2' key={system} onClick={() => clickDestinationSuggestion(system)}>
                      {system}
                    </li>
                  ))
                }
              </ul>
            )
          }
        </div>
        <div className='form-control px-2 w-1/2 lg:w-1/3'>
          <label className='label'>
            <span className='label-text'>Jump range</span>
          </label>
          <div className='input-group'>
            <span>DIST</span>
            <input type='number' min='5' max='85' step='0.1' placeholder='50' value={range} onChange={e => setRange(Number(e.target.value))} className='input input-bordered w-full' />
          </div>
          
        </div>
        <div className='form-control px-2 w-1/2 lg:w-1/3'></div>
        <div className='form-control px-2 w-1/2 lg:w-1/3'> </div>
        <div className='form-control mt-4 px-2 w-1/2 lg:w-1/3 justify-self-end'>
          <button className='btn' onClick={handleSubmit} disabled={isSearching}>Search</button>
        </div>
      </div>
    </Card>
  )
}