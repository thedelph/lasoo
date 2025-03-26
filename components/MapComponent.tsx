"use client"

import React, { useState, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Locksmith {
  id: number;
  companyName: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  locksmiths: Locksmith[];
}

export default function MapComponent({ locksmiths }: MapComponentProps) {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (token) {
      setMapboxToken(token)
    } else {
      console.error("Mapbox access token is missing")
    }
  }, [])

  if (!mapboxToken) {
    return <p>Loading map...</p>
  }

  return (
    <Map
      initialViewState={{
        latitude: 51.5074,
        longitude: -0.1278,
        zoom: 12
      }}
      style={{width: '100%', height: '100%'}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxToken}
    >
      {locksmiths.map((locksmith) => (
        <Marker
          key={locksmith.id}
          latitude={locksmith.latitude}
          longitude={locksmith.longitude}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {locksmith.id}
          </div>
        </Marker>
      ))}
    </Map>
  )
}