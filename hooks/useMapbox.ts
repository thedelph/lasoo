"use client"

import { useState, useEffect } from 'react'

export function useMapbox() {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      console.group('Mapbox Initialization')
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        hasToken: !!token,
        tokenLength: token?.length
      })
      
      if (!token) {
        throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not defined');
      }

      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is empty or invalid');
      }

      if (!token.startsWith('pk.')) {
        throw new Error('Invalid Mapbox token format');
      }

      console.log('Token validation successful')
      console.groupEnd()

      setMapboxToken(token);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Mapbox';
      console.error('Mapbox initialization error:', {
        error: errorMessage,
        env: process.env.NODE_ENV,
        hasToken: !!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      });
      setError(errorMessage);
      setMapboxToken(null);
    }
  }, [])

  return { mapboxToken, error }
}