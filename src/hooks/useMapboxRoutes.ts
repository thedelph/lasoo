import { useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface RoutePoint {
  longitude: number;
  latitude: number;
}

interface RouteData {
  points: RoutePoint[];
  distance: number;
  duration: number;
}

/**
 * Hook to find the nearest road point using Mapbox's Directions API
 */
export function useMapboxRoutes() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Find the nearest point on a road for a given coordinate
   * 
   * @param coordinates - The original coordinates
   * @param mapboxToken - Mapbox access token
   * @returns Promise resolving to the nearest point on a road
   */
  const findNearestRoadPoint = async (
    coordinates: Coordinates,
    mapboxToken: string
  ): Promise<RoutePoint | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the Mapbox Directions API to find the nearest road
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.longitude},${coordinates.latitude}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to find nearest road: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we got a valid response
      if (!data.routes || data.routes.length === 0) {
        console.warn('No routes found near point', coordinates);
        return null;
      }
      
      // Get the first waypoint which should be snapped to the nearest road
      if (data.waypoints && data.waypoints.length > 0) {
        const waypoint = data.waypoints[0];
        
        console.log('Found nearest road point:', waypoint);
        
        return {
          longitude: waypoint.location[0],
          latitude: waypoint.location[1]
        };
      }
      
      // If no waypoints, try to use the first point of the route
      const route = data.routes[0];
      if (route && route.geometry && route.geometry.coordinates && route.geometry.coordinates.length > 0) {
        const firstPoint = route.geometry.coordinates[0];
        
        return {
          longitude: firstPoint[0],
          latitude: firstPoint[1]
        };
      }
      
      return null;
    } catch (err) {
      console.error('Error finding nearest road point:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    findNearestRoadPoint,
    isLoading,
    error
  };
}

export default useMapboxRoutes;
