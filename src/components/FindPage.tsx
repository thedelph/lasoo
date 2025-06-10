import { useSearchParams } from 'react-router-dom'
import LocksmithFinder from './LocksmithFinder'
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper'

export default function FindPage() {
  const [searchParams] = useSearchParams();
  
  // Directly derive values from URL params instead of using state
  const postcode = searchParams.get('postcode') || '';
  const serviceType = searchParams.get('serviceType') || 'home';
  const autoSearch = searchParams.get('autoSearch') === 'true';
  
  // Create a unique key based on the search parameters to force component remount
  // This ensures that when URL params change, LocksmithFinder gets a fresh instance
  const searchKey = `${postcode}-${serviceType}-${autoSearch}-${Date.now()}`;

  return (
    <ErrorBoundaryWrapper>
      <main className="w-full h-screen">
        <LocksmithFinder
          key={searchKey}
          initialPostcode={postcode}
          initialServiceType={serviceType}
        />
      </main>
    </ErrorBoundaryWrapper>
  );
}