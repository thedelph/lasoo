import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocksmithFinder from './LocksmithFinder'
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper'

export default function FindPage() {
  const [searchParams] = useSearchParams()
  const [shouldAutoSearch, setShouldAutoSearch] = useState(false)
  const [searchPostcode, setSearchPostcode] = useState('')
  const [searchServiceType, setSearchServiceType] = useState('')
  
  // Extract search parameters when component mounts
  useEffect(() => {
    const postcode = searchParams.get('postcode')
    const serviceType = searchParams.get('serviceType')
    const autoSearch = searchParams.get('autoSearch')
    
    console.log('FindPage mounted with params:', { postcode, serviceType, autoSearch })
    
    if (postcode && autoSearch === 'true') {
      setSearchPostcode(postcode)
      setSearchServiceType(serviceType || 'home')
      setShouldAutoSearch(true)
    }
  }, [])
  
  return (
    <ErrorBoundaryWrapper>
      <main className="w-full h-screen">
        <LocksmithFinder 
          initialPostcode={searchPostcode}
          initialServiceType={searchServiceType}
          autoSearch={shouldAutoSearch}
        />
      </main>
    </ErrorBoundaryWrapper>
  )
}