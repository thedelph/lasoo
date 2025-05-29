import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LocksmithFinder from './LocksmithFinder'
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper'

export default function FindPage() {
  const [searchParams] = useSearchParams();
  const [searchPostcode, setSearchPostcode] = useState('');
  const [searchServiceType, setSearchServiceType] = useState('');

  // Extract search parameters when component mounts to pass as initial values
  useEffect(() => {
    const postcode = searchParams.get('postcode');
    const serviceType = searchParams.get('serviceType');
    const autoSearch = searchParams.get('autoSearch'); // For logging or other FindPage specific logic if any

    console.log('FindPage mounted with params:', { postcode, serviceType, autoSearch });

    // Set initial postcode and service type for LocksmithFinder
    // LocksmithFinder will handle the autoSearch logic internally based on URL params
    if (postcode) {
      setSearchPostcode(postcode);
    }
    if (serviceType) {
      setSearchServiceType(serviceType);
    } else if (postcode && autoSearch === 'true') {
      // If auto-searching and no serviceType is provided, default to 'home' for initialServiceType
      setSearchServiceType('home');
    }
  }, [searchParams]); // Added searchParams to dependency array

  return (
    <ErrorBoundaryWrapper>
      <main className="w-full h-screen">
        <LocksmithFinder
          initialPostcode={searchPostcode}
          initialServiceType={searchServiceType}
        />
      </main>
    </ErrorBoundaryWrapper>
  );
}