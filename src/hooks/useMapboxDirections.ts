import { useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface SnappedCoordinates extends Coordinates {
  originalLatitude: number;
  originalLongitude: number;
}

/**
 * Hook to snap coordinates to the nearest road using Mapbox's Directions API
 * This is more reliable than Map Matching for single points
 */
export function useMapboxDirections() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Snap a single coordinate to the nearest road
   * 
   * @param coordinates - The original GPS coordinates
   * @param mapboxToken - Mapbox access token
   * @returns Promise resolving to snapped coordinates
   */
  const snapToRoad = async (
    coordinates: Coordinates,
    mapboxToken: string
  ): Promise<SnappedCoordinates> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format coordinates for Mapbox API (longitude,latitude)
      const coordString = `${coordinates.longitude},${coordinates.latitude}`;
      
      // Call Mapbox Directions API with the 'snapping' profile
      // This will snap the point to the nearest road
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?access_token=${mapboxToken}&geometries=geojson&overview=full&annotations=duration,distance,speed&steps=true`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Road snapping failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we got a valid response
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.warn('No road match found, using original coordinates', data);
        return {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          originalLatitude: coordinates.latitude,
          originalLongitude: coordinates.longitude
        };
      }
      
      try {
        // Get the waypoint from the response which contains the snapped coordinates
        const waypoint = data.waypoints[0];
        
        if (!waypoint || !waypoint.location) {
          throw new Error('No waypoint location found in response');
        }
        
        // Mapbox returns waypoint locations as [longitude, latitude]
        const snappedLongitude = waypoint.location[0];
        const snappedLatitude = waypoint.location[1];
        
        console.log('Successfully snapped to road:', {
          original: [coordinates.longitude, coordinates.latitude],
          snapped: [snappedLongitude, snappedLatitude]
        });
        
        return {
          latitude: snappedLatitude,
          longitude: snappedLongitude,
          originalLatitude: coordinates.latitude,
          originalLongitude: coordinates.longitude
        };
      } catch (err) {
        console.error('Error extracting snapped point:', err, data);
        // Fallback to original coordinates
        return {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          originalLatitude: coordinates.latitude,
          originalLongitude: coordinates.longitude
        };
      }
    } catch (err) {
      console.error('Error snapping to road:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Return original coordinates on error
      return {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        originalLatitude: coordinates.latitude,
        originalLongitude: coordinates.longitude
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Batch snap multiple coordinates to nearest roads
   * 
   * @param coordinatesArray - Array of coordinates to snap
   * @param mapboxToken - Mapbox access token
   * @returns Promise resolving to array of snapped coordinates
   */
  const batchSnapToRoad = async (
    coordinatesArray: Coordinates[],
    mapboxToken: string
  ): Promise<SnappedCoordinates[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Process each coordinate individually
      const promises = coordinatesArray.map(coords => 
        snapToRoad(coords, mapboxToken)
      );
      
      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      console.error('Error in batch road snapping:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Return original coordinates on error
      return coordinatesArray.map(coords => ({
        latitude: coords.latitude,
        longitude: coords.longitude,
        originalLatitude: coords.latitude,
        originalLongitude: coords.longitude
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    snapToRoad,
    batchSnapToRoad,
    isLoading,
    error
  };
}

export default useMapboxDirections;
