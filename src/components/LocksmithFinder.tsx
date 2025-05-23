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
// Padding in pixels around the bounds - more at the bottom to account for results panel
const PADDING = { top: 50, bottom: 200, left: 50, right: 50 }

const INITIAL_VIEW = {
  latitude: 54.093409,
  longitude: -2.89479,
  zoom: 5
}

interface LocksmithFinderProps {
  initialPostcode?: string;
  initialServiceType?: string;
  autoSearch?: boolean;
}

export default function LocksmithFinder({
  initialPostcode = '',
  initialServiceType = 'home',
  autoSearch = false
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
      mapRef.current.flyTo({
        center: [searchLoc.longitude, searchLoc.latitude],
        zoom: DEFAULT_ZOOM,
        duration: 2000
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
      padding: PADDING,
      duration: 2000
    });
  };

  const handleSearch = async (searchPostcode: string) => {
    console.log('handleSearch called with:', searchPostcode, 'service:', service);
    if (!searchPostcode.trim() || !mapboxToken) return;

    setGeocoding(true);
    setHasSearched(true);
    setSelectedLocksmith(null);
    setAvailableLocksmiths([]);
    setSearchLocation(null);
    
    try {
      // Geocode postcode
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchPostcode
        )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Invalid postcode');
      }

      const [longitude, latitude] = data.features[0].center;
      const searchLoc = { latitude, longitude };
      setSearchLocation(searchLoc);

      // Find nearby locksmiths with the 'either' mode to check both HQ and current locations
      const locksmiths = await findNearby(latitude, longitude, 25, service, 'either' as 'current' | 'hq' | 'either');
      setAvailableLocksmiths(locksmiths);
      
      // Fit map to include search location and any results
      fitMapToResults(searchLoc, locksmiths);

      if (locksmiths.length === 0) {
        toast.info('No locksmiths found in your area');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setAvailableLocksmiths([]);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      navigate(`/find?postcode=${encodeURIComponent(postcode.trim())}&serviceType=${service}`);
      handleSearch(postcode.trim());
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
        padding: { bottom: 200, top: 50, left: 50, right: 50 } // Add padding to keep marker visible
      });
    }
  };

  const handleBack = () => {
    setSelectedLocksmith(null);
    
    // Restore previous bounds when going back to results
    if (mapRef.current && resultsBounds) {
      mapRef.current.fitBounds(resultsBounds, {
        padding: PADDING,
        duration: 2000
      });
    }
  };

  // Simple direct auto-search effect - with proper dependencies
  useEffect(() => {
    // Only run if we actually have the data and haven't searched yet
    if (autoSearch && postcode && !hasSearched) {
      console.log('Direct auto-search triggered with:', postcode, service);
      
      // Immediate timeout to break execution context but still run quickly
      const timer = setTimeout(() => {
        handleSearch(postcode);
      }, 10); // Much shorter delay for responsiveness
      
      return () => clearTimeout(timer);
    }
  }, [autoSearch, postcode, service, hasSearched]); // Include all dependencies

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