/**
 * @file MapView.tsx
 * @description Map component that displays search location and locksmith markers
 * Represents both current locations and HQ locations for tradespeople
 */

import React, { useEffect, useState } from 'react'
import Map, { Marker, MapRef, Source, Layer } from 'react-map-gl'
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
  /** Currently selected locksmith */
  selectedLocksmith?: Locksmith | null
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
  selectedLocksmith,
  onMarkerClick
}: MapViewProps) {
  const [error, setError] = useState<string | null>(null)
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  
  // Create service radius GeoJSON for the selected locksmith
  const serviceRadiusGeoJSON = React.useMemo(() => {
    if (!selectedLocksmith) return null;
    
    // Find the HQ location for service radius calculation
    const hqLocation = selectedLocksmith.locations?.find(loc => !loc.isCurrentLocation);
    
    // If no HQ location, we can't show service radius
    if (!hqLocation) return null;
    
    // Service radius in kilometers
    const radiusKm = selectedLocksmith.serviceRadius || 25;
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(hqLocation.longitude), Number(hqLocation.latitude)]
      },
      properties: {
        radius: radiusKm * 1000 // Convert to meters for mapbox
      }
    };
  }, [selectedLocksmith]);

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

        {/* Service Radius Circle - Using a custom data-driven radius function */}
        {serviceRadiusGeoJSON && (
          <Source
            id="service-radius"
            type="geojson"
            data={serviceRadiusGeoJSON as any}
          >
            <Layer
              id="service-radius-fill"
              type="circle"
              paint={{
                // Convert km to pixels using a zoom-based scale factor
                // Radius is scaled based on zoom level so it appears correctly at all zoom levels
                'circle-radius': [
                  'interpolate',
                  ['exponential', 2],
                  ['zoom'],
                  // At lower zoom levels, scale the circle down
                  0, ['/', ['get', 'radius'], 50000], // Tiny at world view
                  8, ['/', ['get', 'radius'], 800],   // Small at country view
                  10, ['/', ['get', 'radius'], 150],  // Medium at city view
                  13, ['/', ['get', 'radius'], 30],   // Larger at neighborhood view
                  15, ['/', ['get', 'radius'], 8]     // Full size at street view
                ],
                'circle-color': '#4338ca', // indigo color
                'circle-opacity': 0.15,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#4338ca',
                'circle-stroke-opacity': 0.3
              }}
            />
          </Source>
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
          
          // Find HQ and current locations
          const hqLocation = locksmith.locations.find(loc => !loc.isCurrentLocation);
          const currentLocation = locksmith.locations.find(loc => loc.isCurrentLocation);
          
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
              
              {/* ALWAYS show HQ location with home icon if available */}
              {hqLocation && (
                <Marker
                  key={`${locksmith.id}-hq`}
                  latitude={hqLocation.latitude}
                  longitude={hqLocation.longitude}
                  anchor="bottom"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => onMarkerClick(locksmith)}
                    title={`${locksmith.companyName} (Headquarters)`}
                  >
                    <Home className="h-5 w-5 text-indigo-600" />
                  </div>
                </Marker>
              )}
              
              {/* ALWAYS show current location with navigation icon if available */}
              {currentLocation && (
                <Marker
                  key={`${locksmith.id}-current`}
                  latitude={currentLocation.latitude}
                  longitude={currentLocation.longitude}
                  anchor="bottom"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => onMarkerClick(locksmith)}
                    title={`${locksmith.companyName} (Current Location)`}
                  >
                    <Navigation className="h-5 w-5 text-blue-600" />
                  </div>
                </Marker>
              )}
              
              {/* For backward compatibility, show any other locations not covered above */}
              {locksmith.locations
                .filter(loc => 
                  // Not already shown as HQ or current location
                  (hqLocation && loc.latitude === hqLocation.latitude && loc.longitude === hqLocation.longitude) === false &&
                  (currentLocation && loc.latitude === currentLocation.latitude && loc.longitude === currentLocation.longitude) === false &&
                  // Not the same as primary marker
                  (loc.latitude === locksmith.latitude && loc.longitude === locksmith.longitude) === false
                )
                .map((location, locIdx) => {
                
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