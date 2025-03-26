import React, { useEffect, useState } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { AlertCircle, MapPin } from 'lucide-react'
import type { Locksmith } from '../../types/locksmith'

interface MapViewProps {
  mapRef: React.RefObject<MapRef>
  viewport: {
    latitude: number
    longitude: number
    zoom: number
  }
  onMove: (evt: any) => void
  hasSearched: boolean
  searchLocation: { latitude: number; longitude: number } | null
  availableLocksmiths: Locksmith[]
  onMarkerClick: (locksmith: Locksmith) => void
}

export default function MapView({
  mapRef,
  viewport,
  onMove,
  hasSearched,
  searchLocation,
  availableLocksmiths,
  onMarkerClick
}: MapViewProps) {
  const [error, setError] = useState<string | null>(null)
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    console.log('MapView update:', {
      hasToken: !!mapboxToken,
      locksmiths: availableLocksmiths.length,
      viewport,
      searchLocation
    });
  }, [mapboxToken, availableLocksmiths, viewport, searchLocation]);

  const handleMapError = (e: any) => {
    console.error('Map error:', e);
    setError(e.error?.message || 'Failed to load map');
  };

  const handleMapLoad = () => {
    console.log('Map loaded successfully');
    setError(null);
  };

  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2 max-w-md">
          <AlertCircle className="h-5 w-5" />
          <span>Map configuration error: Missing access token</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Map
        ref={mapRef}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        onError={handleMapError}
        onLoad={handleMapLoad}
        attributionControl={true}
        reuseMaps
        {...viewport}
        onMove={onMove}
      >
        {error && (
          <div className="absolute top-0 left-0 right-0 z-50">
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2 max-w-md mx-auto mt-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search Location Pin */}
        {hasSearched && searchLocation && (
          <Marker
            latitude={searchLocation.latitude}
            longitude={searchLocation.longitude}
            anchor="bottom"
          >
            <div className="animate-bounce">
              <MapPin className="h-8 w-8 text-blue-600 stroke-2" />
            </div>
          </Marker>
        )}
        
        {/* Locksmith Markers */}
        {hasSearched && availableLocksmiths.map((locksmith, index) => {
          console.log('Rendering marker:', {
            company: locksmith.companyName,
            lat: locksmith.latitude,
            lng: locksmith.longitude
          });
          
          return (
            <Marker
              key={locksmith.id}
              latitude={locksmith.latitude}
              longitude={locksmith.longitude}
              anchor="bottom"
            >
              <button 
                className="w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center text-sm font-medium shadow-md"
                onClick={() => onMarkerClick(locksmith)}
              >
                {index + 1}
              </button>
            </Marker>
          );
        })}
      </Map>
    </>
  )
}