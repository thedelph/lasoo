import { useState, useRef, useEffect } from 'react'
import { MapRef } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import MapView from './map/MapView'
import SearchForm from './search/SearchForm'
import ResultsPane from './results/ResultsPane'
import { useMapbox } from '../hooks/useMapbox'
import { useLocksmiths } from '../hooks/useLocksmiths'
import type { Locksmith } from '../types/locksmith'

const DEFAULT_ZOOM = 12

// Dynamic padding calculation to account for results panel
const calculatePadding = () => {
  // Results pane is max 30vh + 48px (margins/padding)
  // On mobile, we need more relative padding
  const isMobile = window.innerWidth < 768;
  const viewportHeight = window.innerHeight;
  
  return {
    top: 50,
    // Mobile: 40% of viewport (min 300px), Desktop: 35% of viewport (min 350px)
    bottom: isMobile 
      ? Math.max(viewportHeight * 0.4, 300) 
      : Math.max(viewportHeight * 0.35, 350),
    left: 50,
    right: 50
  };
}

const INITIAL_VIEW = {
  latitude: 54.093409,
  longitude: -2.89479,
  zoom: 5
}

interface LocksmithFinderProps {
  initialPostcode?: string;
  initialServiceType?: string;
  // autoSearch prop removed as it's now handled by URL parameter 'autoSearch'
}

export default function LocksmithFinder({
  initialPostcode = '',
  initialServiceType = 'home'
  // autoSearch prop removed
}: LocksmithFinderProps) {
  const mapRef = useRef<MapRef>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mapboxToken } = useMapbox()
  const { findNearby, loading: searching } = useLocksmiths()
  
  // Use props first, fall back to URL params
  const [postcode, setPostcode] = useState(initialPostcode || searchParams.get('postcode') || "")
  const [service, setService] = useState(initialServiceType || searchParams.get('serviceType') || "home")
  const [availableLocksmiths, setAvailableLocksmiths] = useState<Locksmith[]>([])
  const [selectedLocksmith, setSelectedLocksmith] = useState<Locksmith | null>(null)
  const [viewport, setViewport] = useState(INITIAL_VIEW)
  const [hasSearched, setHasSearched] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [searchLocation, setSearchLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [resultsBounds, setResultsBounds] = useState<mapboxgl.LngLatBounds | null>(null)

  const fitMapToResults = (
    searchLoc: { latitude: number; longitude: number },
    locksmiths: Locksmith[]
  ) => {
    if (!mapRef.current) return;

    if (locksmiths.length === 0) {
      // If no results, just center on search location with default zoom
      // Use extra padding to ensure search pin is visible above "No results" message
      const noPadding = calculatePadding();
      noPadding.bottom = noPadding.bottom + 50; // Add extra space for no results message
      
      mapRef.current.flyTo({
        center: [searchLoc.longitude, searchLoc.latitude],
        zoom: DEFAULT_ZOOM,
        duration: 2000,
        padding: noPadding
      });
      return;
    }

    // Create bounds with search location
    const bounds = new mapboxgl.LngLatBounds(
      [searchLoc.longitude, searchLoc.latitude],
      [searchLoc.longitude, searchLoc.latitude]
    );

    // Extend bounds to include all locksmith locations
    locksmiths.forEach(locksmith => {
      bounds.extend([locksmith.longitude, locksmith.latitude]);
    });

    // Store bounds for later use
    setResultsBounds(bounds);

    // Fit map to bounds with padding
    mapRef.current.fitBounds(bounds, {
      padding: calculatePadding(),
      duration: 2000
    });
  };

  const handleSearch = async (searchPostcode: string, serviceType?: string) => {
    const searchService = serviceType || service;
    console.log('handleSearch called with:', searchPostcode, 'service:', searchService);

    if (!searchPostcode.trim() || !mapboxToken) {
      console.warn('handleSearch returning early. Postcode empty or token missing. Postcode:', searchPostcode.trim(), 'Token:', !!mapboxToken);
      if (!searchPostcode.trim()) {
        toast.error('Please enter a postcode');
      }
      if (!mapboxToken) {
        toast.error('Map service not available');
      }
      return;
    }
    

    setGeocoding(true);
    // Don't set hasSearched to true yet - wait until search completes
    setSelectedLocksmith(null);
    setAvailableLocksmiths([]);
    setSearchLocation(null);
    
    try {
      // Geocode postcode with retry logic
      let response = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchPostcode
            )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
          );
          
          if (response.ok) {
            break;
          } else if (response.status >= 500 && retryCount < maxRetries - 1) {
            // Server error, retry
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          } else {
            throw new Error(`Geocoding failed: ${response.statusText}`);
          }
        } catch (error) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Geocoding attempt ${retryCount}/${maxRetries} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          } else {
            throw error;
          }
        }
      }

      if (!response || !response.ok) {
        throw new Error('Geocoding failed after retries');
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Invalid postcode');
      }

      const [longitude, latitude] = data.features[0].center;
      const searchLoc = { latitude, longitude };
      setSearchLocation(searchLoc);

      // Find nearby locksmiths with the 'either' mode to check both HQ and current locations
      let locksmiths = await findNearby(latitude, longitude, 25, searchService, 'either' as 'current' | 'hq' | 'either');

      // Sort locksmiths by distance before setting state
      locksmiths.sort((a, b) => a.distance - b.distance);

      setAvailableLocksmiths(locksmiths);
      // Now that we have results (or confirmed no results), set hasSearched to true
      setHasSearched(true);
      console.log('Set availableLocksmiths:', locksmiths.length, 'locksmiths');
      console.log('hasSearched:', true);
      
      // Fit map to include search location and any results
      fitMapToResults(searchLoc, locksmiths);

      if (locksmiths.length === 0) {
        toast.info('No locksmiths found in your area');
      } else {
        console.log(`Found ${locksmiths.length} locksmiths in your area`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setAvailableLocksmiths([]);
      // Even on error, set hasSearched to true so we show "No results" instead of nothing
      setHasSearched(true);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent, serviceType?: string) => {
    e.preventDefault();
    if (postcode.trim()) {
      // Always trigger a search when the form is submitted
      handleSearch(postcode.trim(), serviceType);
    }
  };

  const resetSearch = () => {
    setPostcode("");
    setService("home");
    setHasSearched(false);
    setSelectedLocksmith(null);
    setAvailableLocksmiths([]);
    setViewport(INITIAL_VIEW);
    setSearchLocation(null);
    setResultsBounds(null);
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
        zoom: INITIAL_VIEW.zoom,
        duration: 2000
      });
    }
    
    navigate('/find');
  };

  const handleMarkerClick = (locksmith: Locksmith) => {
    setSelectedLocksmith(locksmith);
    
    if (mapRef.current) {
      // Add offset to center the marker higher on the screen to account for the results panel
      mapRef.current.flyTo({
        center: [locksmith.longitude, locksmith.latitude],
        zoom: 14,
        duration: 2000,
        padding: calculatePadding() // Use dynamic padding
      });
    }
  };

  const handleBack = () => {
    setSelectedLocksmith(null);
    
    // Restore previous bounds when going back to results
    if (mapRef.current && resultsBounds) {
      mapRef.current.fitBounds(resultsBounds, {
        padding: calculatePadding(),
        duration: 2000
      });
    }
  };

  // Simple direct auto-search effect - with proper dependencies
  useEffect(() => {
    // This effect handles automatic searching when the page is loaded with specific URL parameters.
    // It's triggered by `autoSearch=true` in the URL, typically set when navigating from the landing page.
    const shouldAutoSearchFromUrl = searchParams.get('autoSearch') === 'true';

    // Conditions for auto-search:
    // 1. `autoSearch=true` is in the URL.
    // 2. A `postcode` is available (either from URL params or initial props).
    // 3. The `mapboxToken` is loaded (required for geocoding in `handleSearch`).
    // 4. A search hasn't already been performed in this component instance (`!hasSearched`).
    if (shouldAutoSearchFromUrl && postcode && mapboxToken && !hasSearched) {
      // Add a small delay to ensure all components are mounted and ready
      const timer = setTimeout(() => {
        handleSearch(postcode);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, postcode, service, hasSearched, mapboxToken]);

  return (
    <div className="relative w-full h-screen">
      <MapView
        mapRef={mapRef}
        viewport={viewport}
        onMove={evt => setViewport(evt.viewState)}
        hasSearched={hasSearched}
        availableLocksmiths={availableLocksmiths}
        selectedLocksmith={selectedLocksmith}
        onMarkerClick={handleMarkerClick}
        searchLocation={searchLocation}
      />

      <SearchForm
        postcode={postcode}
        service={service}
        searching={searching || geocoding}
        onPostcodeChange={setPostcode}
        onServiceChange={setService}
        onSubmit={handleSubmit}
      />

      <ResultsPane
        hasSearched={hasSearched}
        selectedLocksmith={selectedLocksmith}
        availableLocksmiths={availableLocksmiths}
        onLocksmithSelect={handleMarkerClick}
        onBack={handleBack}
        onReset={resetSearch}
      />
    </div>
  )
}