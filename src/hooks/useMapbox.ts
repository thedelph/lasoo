import { useState } from 'react';

export function useMapbox() {
  // Initialize token synchronously to avoid race conditions
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;
  
  const [mapboxToken] = useState<string | null>(() => {
    if (!token) return null;
    if (!token.startsWith('pk.')) return null;
    return token;
  });
  
  const [error] = useState<string | null>(() => {
    if (!token) return 'Missing Mapbox access token';
    if (!token.startsWith('pk.')) return 'Invalid Mapbox access token format';
    return null;
  });

  return { mapboxToken, error };
}