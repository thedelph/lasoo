import { useState, useEffect } from 'react';

export function useMapbox() {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    if (!token) {
      setError('Missing Mapbox access token');
      return;
    }

    if (!token.startsWith('pk.')) {
      setError('Invalid Mapbox access token format');
      return;
    }

    setMapboxToken(token);
    setError(null);
  }, []);

  return { mapboxToken, error };
}