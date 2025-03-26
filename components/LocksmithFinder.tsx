"use client"

import React, { useState, useRef, useEffect } from 'react'
import { MapRef } from 'react-map-gl'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import MapView from './map/MapView'
import SearchForm from './search/SearchForm'
import ResultsPane from './results/ResultsPane'
import { useGeocoding } from '@/hooks/useGeocoding'
import { useLocksmiths } from '@/hooks/useLocksmiths'

const INITIAL_VIEW = {
  latitude: 54.093409,
  longitude: -2.89479,
  zoom: 5
}

export default function LocksmithFinder() {
  const mapRef = useRef<MapRef>(null)
  const { geocodePostcode, loading: geocoding } = useGeocoding()
  const { findNearby, loading: searching } = useLocksmiths()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [postcode, setPostcode] = useState(searchParams?.get('postcode') || "")
  const [service, setService] = useState("home")
  const [availableLocksmiths, setAvailableLocksmiths] = useState([])
  const [selectedLocksmith, setSelectedLocksmith] = useState(null)
  const [viewport, setViewport] = useState(INITIAL_VIEW)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchPostcode: string) => {
    if (!searchPostcode.trim()) return;

    console.log('Starting search for postcode:', searchPostcode);
    setHasSearched(true);
    setSelectedLocksmith(null);
    setAvailableLocksmiths([]);
    
    try {
      console.log('Geocoding postcode...');
      const coords = await geocodePostcode(searchPostcode);
      console.log('Coordinates received:', coords);

      const newViewport = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        zoom: 12
      };

      setViewport(newViewport);
      
      if (mapRef.current) {
        console.log('Updating map view...');
        mapRef.current.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: 12,
          duration: 2000
        });
      }

      console.log('Finding nearby locksmiths...');
      const locksmiths = await findNearby(
        coords.latitude,
        coords.longitude,
        25,
        service
      );
      
      console.log('Locksmiths found:', locksmiths.length);
      setAvailableLocksmiths(locksmiths);
      
      if (locksmiths.length === 0) {
        toast.info('No locksmiths found in your area');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setAvailableLocksmiths([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      router.push(`/find?postcode=${encodeURIComponent(postcode.trim())}`);
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
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
        zoom: INITIAL_VIEW.zoom,
        duration: 2000
      });
    }
    
    router.push('/find');
  };

  const handleMarkerClick = (locksmith) => {
    setSelectedLocksmith(locksmith);
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [locksmith.longitude, locksmith.latitude],
        zoom: 14,
        duration: 2000
      });
    }
  };

  // Handle initial postcode from URL
  useEffect(() => {
    const initialPostcode = searchParams?.get('postcode');
    if (initialPostcode) {
      console.log('Initial postcode found in URL:', initialPostcode);
      handleSearch(initialPostcode);
    }
  }, []);

  return (
    <div className="relative w-full h-screen">
      <MapView
        mapRef={mapRef}
        viewport={viewport}
        onMove={evt => setViewport(evt.viewState)}
        hasSearched={hasSearched}
        availableLocksmiths={availableLocksmiths}
        onMarkerClick={handleMarkerClick}
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
        onBack={() => setSelectedLocksmith(null)}
        onReset={resetSearch}
      />
    </div>
  )
}