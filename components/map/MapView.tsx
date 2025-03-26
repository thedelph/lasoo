'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Locksmith } from '@/types/locksmith';
import { AlertCircle } from 'lucide-react';
import { useMapbox } from '@/hooks/useMapbox';

interface MapViewProps {
  mapRef: React.RefObject<MapRef>;
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  onMove: (evt: any) => void;
  hasSearched: boolean;
  availableLocksmiths: Locksmith[];
  onMarkerClick: (locksmith: Locksmith) => void;
}

export default function MapView({
  mapRef,
  viewport,
  onMove,
  hasSearched,
  availableLocksmiths,
  onMarkerClick,
}: MapViewProps) {
  const [error, setError] = useState<string | null>(null);
  const { mapboxToken, error: tokenError } = useMapbox();

  useEffect(() => {
    console.group('MapView Component');
    console.log('Current state:', {
      hasToken: !!mapboxToken,
      tokenError,
      viewport,
      hasSearched,
      locksmithCount: availableLocksmiths.length,
    });
    console.groupEnd();

    if (tokenError) {
      console.error('Mapbox token error:', tokenError);
      setError(tokenError);
    }
  }, [tokenError, mapboxToken, viewport, hasSearched, availableLocksmiths]);

  if (!mapboxToken) {
    const errorMsg = 'Map configuration error: Missing access token';
    console.error(errorMsg, {
      token: mapboxToken,
      error: tokenError,
    });
    return (
      <div className="flex items-center justify-center h-full bg-base-200">
        <div className="alert alert-error max-w-md">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      </div>
    );
  }

  const handleMapError = (e: any) => {
    console.group('Mapbox Error');
    console.error('Details:', {
      error: e.error,
      message: e.error?.message || 'Unknown error',
      status: e.status,
      type: e.type,
      viewport,
      hasToken: !!mapboxToken,
    });
    console.trace('Error stack trace');
    console.groupEnd();

    setError(
      `Map error: ${
        e.error?.message || 'Configuration error. Please try again later.'
      }`
    );
  };

  const handleMapLoad = () => {
    console.group('Map Load Event');
    console.log('Success:', {
      viewport,
      markersCount: availableLocksmiths.length,
      hasToken: !!mapboxToken,
    });
    console.groupEnd();
    setError(null);
  };

  return (
    <>
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        onError={handleMapError}
        onLoad={handleMapLoad}
        attributionControl={true}
        reuseMaps
        {...viewport}
        onMove={onMove}
        transformRequest={(url, resourceType) => {
          console.log('Map resource request:', { url, resourceType });
          return { url };
        }}
      >
        {error && (
          <div className="absolute top-0 left-0 right-0 z-50">
            <div className="alert alert-error max-w-md mx-auto mt-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {hasSearched &&
          availableLocksmiths.map((locksmith, index) => (
            <Marker
              key={locksmith.id}
              latitude={locksmith.latitude}
              longitude={locksmith.longitude}
              anchor="bottom"
            >
              <button
                className="btn btn-circle btn-sm bg-primary text-primary-content hover:bg-primary-focus"
                onClick={() => onMarkerClick(locksmith)}
              >
                {index + 1}
              </button>
            </Marker>
          ))}
      </Map>
    </>
  );
}
