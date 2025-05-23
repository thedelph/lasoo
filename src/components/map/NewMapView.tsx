/**
 * @file MapView.tsx
 * @description Map component that displays search location and locksmith markers
 * Represents both current locations and HQ locations for tradespeople
 */

import React, { useEffect, useState, useRef } from 'react';
import Map, { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle } from 'lucide-react';

import type { Locksmith } from '../../types/locksmith';
import SearchPin from './SearchPin';
import TradespersonMarker from './TradespersonMarker';
import { snapToRoads, prepareLocationsForSnapping } from './utils/roadSnapping';
import { SnappedPoint } from './utils/mapHelpers';

/**
 * Props for the MapView component
 */
interface MapViewProps {
  /** Reference to the map instance for programmatic control */
  mapRef: React.RefObject<MapRef>;
  /** Current map viewport (center coordinates and zoom level) */
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  /** Callback for map movement events */
  onMove: (evt: any) => void;
  /** Whether a search has been performed */
  hasSearched: boolean;
  /** Coordinates of the searched location (postcode) */
  searchLocation: { latitude: number; longitude: number } | null;
  /** List of locksmith/tradesperson results within the search radius */
  availableLocksmiths: Locksmith[];
  /** Currently selected locksmith */
  selectedLocksmith?: Locksmith | null;
  /** Callback when a locksmith marker is clicked */
  onMarkerClick: (locksmith: Locksmith) => void;
}

/**
 * Map component that displays:
 * 1. The base street map using Mapbox
 * 2. A pin for the searched postcode location
 * 3. Numbered circular markers for primary locksmith locations
 * 4. Navigation icons for current locations (when different from primary)
 * 5. Home icons for HQ locations (when different from current location)
 */
export default function MapView({
  mapRef,
  viewport,
  onMove,
  hasSearched,
  searchLocation,
  availableLocksmiths,
  selectedLocksmith, // Added selectedLocksmith here
  onMarkerClick
}: MapViewProps) {
  const [error, setError] = useState<string | null>(null);
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  // State to store road-snapped coordinates
  const [roadSnappedPoints, setRoadSnappedPoints] = useState<Record<string, SnappedPoint>>({});
  
  // State to store visible markers (to prevent overlapping)
  const [visibleMarkers, setVisibleMarkers] = useState<Record<string, boolean>>({});
  
  // Reference to the map instance
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  
  // Store the map instance when it loads
  const storeMapInstance = () => {
    if (mapRef.current) {
      // @ts-ignore - we need to access the internal map instance
      mapInstanceRef.current = mapRef.current.getMap();
    }
  };
  
  // Handle road snapping on component mount and when locksmiths change
  useEffect(() => {
    // Skip if no locksmiths or no token
    if (!availableLocksmiths || !availableLocksmiths.length || !mapboxToken) {
      return;
    }
    
    async function performRoadSnapping() {
      try {
        // Prepare locations for snapping
        const locationsToSnap = prepareLocationsForSnapping(availableLocksmiths);
        
        // Skip if no locations to snap
        if (!locationsToSnap.length) {
          return;
        }
        
        // Snap to roads
        const snapped = await snapToRoads(locationsToSnap, mapboxToken);
        setRoadSnappedPoints(snapped);
      } catch (error) {
        console.error('Error in road snapping:', error);
      }
    }
    
    performRoadSnapping();
  }, [availableLocksmiths, mapboxToken]);
  
  // Determine visible markers to prevent overlap
  useEffect(() => {
    // Skip if no locksmiths
    if (!availableLocksmiths || !availableLocksmiths.length) {
      return;
    }
    
    // Start with all markers visible
    const newVisibleMarkers: Record<string, boolean> = {};
    
    // Process all tradesperson markers
    availableLocksmiths.forEach(locksmith => {
      // Always show van marker for current location (higher priority)
      newVisibleMarkers[`${locksmith.id}-van`] = true;
      
      // Always show HQ marker if no current location
      const hasCurrentLocation = locksmith.locations.some(loc => loc.isCurrentLocation);
      newVisibleMarkers[`${locksmith.id}-hq`] = !hasCurrentLocation;
    });
    
    setVisibleMarkers(newVisibleMarkers);
  }, [availableLocksmiths]);
  
  // Handle map errors
  const handleMapError = (e: any) => {
    console.error('Map error:', e);
    setError('Failed to load map. Please check your connection and refresh.');
  };
  
  // Handle map load
  const handleMapLoad = () => {
    setError(null);
    storeMapInstance();
  };
  
  return (
    <>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-80">
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-red-600">{error}</span>
          </div>
        </div>
      )}
      
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          latitude: viewport.latitude,
          longitude: viewport.longitude,
          zoom: viewport.zoom
        }}
        onMove={onMove}
        onError={handleMapError}
        onLoad={handleMapLoad}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Display the search location pin */}
        {hasSearched && searchLocation && (
          <SearchPin 
            latitude={searchLocation.latitude} 
            longitude={searchLocation.longitude} 
          />
        )}
        
        {/* Display tradesperson markers */}
        {availableLocksmiths.map((locksmith, index) => (
          <TradespersonMarker
            key={locksmith.id}
            locksmith={locksmith}
            visibleMarkers={visibleMarkers}
            roadSnappedPoints={roadSnappedPoints}
            onMarkerClick={onMarkerClick}
            displayNumber={index + 1}
            isSelected={selectedLocksmith?.id === locksmith.id}
          />
        ))}
      </Map>
    </>
  );
}
