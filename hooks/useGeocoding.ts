"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import { useMapbox } from './useMapbox';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const { mapboxToken } = useMapbox();

  const geocodePostcode = async (postcode: string): Promise<Coordinates> => {
    console.group('Geocoding');
    console.log('Geocoding postcode:', postcode);
    setLoading(true);
    
    try {
      if (!mapboxToken) {
        console.error('No Mapbox token available');
        throw new Error('Map configuration is missing');
      }

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        postcode
      )}.json?country=GB&types=postcode&access_token=${mapboxToken}`;

      console.log('Fetching coordinates...');
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Geocoding API error:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error('Failed to geocode postcode');
      }

      const data = await response.json();
      console.log('Geocoding response:', {
        features: data.features?.length || 0,
        query: data.query
      });
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Invalid postcode');
      }

      const [longitude, latitude] = data.features[0].center;
      console.log('Coordinates found:', { latitude, longitude });

      return { latitude, longitude };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  return { geocodePostcode, loading };
}