/**
 * @file MapView.tsx
 * @description Map component that displays search location and locksmith markers
 * Represents both current locations and HQ locations for tradespeople
 */

import React, { useEffect, useState } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { AlertCircle, MapPin, Home, Navigation } from 'lucide-react'
import type { Locksmith } from '../../types/locksmith'

/**
 * Props for the MapView component
 */
interface MapViewProps {
  /** Reference to the map instance for programmatic control */
  mapRef: React.RefObject<MapRef>
  /** Current map viewport (center coordinates and zoom level) */
  viewport: {
    latitude: number
    longitude: number
    zoom: number
  }
  /** Callback for map movement events */
  onMove: (evt: any) => void
  /** Whether a search has been performed */
  hasSearched: boolean
  /** Coordinates of the searched location (postcode) */
  searchLocation: { latitude: number; longitude: number } | null
  /** List of locksmith/tradesperson results within the search radius */
  availableLocksmiths: Locksmith[]
  /** Callback when a locksmith marker is clicked */
  onMarkerClick: (locksmith: Locksmith) => void
}

/**
 * Map component that displays:
 * 1. The base street map using Mapbox
 * 2. A pin for the searched postcode location
 * 3. Numbered circular markers for primary locksmith locations
 * 4. Navigation icons for current locations (when different from primary)
 * 5. Home icons for HQ locations (when different from current location)
 *
 * @param props - Component props (see MapViewProps interface)
 * @returns React component
 */
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
        
        {/* Locksmith/Tradesperson Markers */}
        {hasSearched && availableLocksmiths.map((locksmith, index) => {
          console.log('Rendering locksmith:', {
            company: locksmith.companyName,
            locations: locksmith.locations.length
          });
          
          // Render all locations for this locksmith (both current and HQ locations)
          return (
            <React.Fragment key={locksmith.id}>
              {/* 
                Primary marker with numbered indicator (blue circle with number)
                This is the main marker shown on the map for each tradesperson
              */}
              <Marker
                key={`primary-${locksmith.id}`}
                latitude={locksmith.latitude}
                longitude={locksmith.longitude}
                anchor="bottom"
              >
                <button 
                  className="w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center text-sm font-medium shadow-md"
                  onClick={() => onMarkerClick(locksmith)}
                  title={`${locksmith.companyName}`}
                >
                  {index + 1}
                </button>
              </Marker>
              
              {/* 
                Additional location markers (Navigation icon or Home icon)
                - Navigation icon = current location if different from primary
                - Home icon = HQ location (from company postcode) if different from primary
                
                These give users visibility of both where the tradesperson is
                currently located and where their business is headquartered.
              */}
              {locksmith.locations.map((location, locIdx) => {
                // Skip the primary location as it's already shown
                if (location.latitude === locksmith.latitude && 
                    location.longitude === locksmith.longitude) {
                  return null;
                }
                
                return (
                  <Marker
                    key={`${locksmith.id}-loc-${locIdx}`}
                    latitude={location.latitude}
                    longitude={location.longitude}
                    anchor="bottom"
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        // Ensure we're working with a copy to avoid modifying the original
                        const locksmithCopy = {...locksmith};
                        onMarkerClick(locksmithCopy);
                      }}
                      title={`${locksmith.companyName} ${location.isCurrentLocation ? '(Current Location)' : '(Headquarters)'}`}
                    >
                      {location.isCurrentLocation ? (
                        <Navigation className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Home className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </Marker>
                );
              })}
            </React.Fragment>
          );
        })}
      </Map>
    </>
  )
}