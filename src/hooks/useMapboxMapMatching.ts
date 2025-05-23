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
 * Hook to snap coordinates to the nearest road using Mapbox's Map Matching API
 * This is useful for ensuring vehicle icons appear on roads rather than in buildings/water/etc.
 */
export function useMapboxMapMatching() {
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
      // The Map Matching API requires at least 2 points to work properly
      // We'll create a second point slightly offset from the original to simulate movement
      // This helps the API understand the direction of travel on the road
      const offsetLat = coordinates.latitude + 0.0003; // Small offset ~30m
      const offsetLng = coordinates.longitude + 0.0003;
      
      // Format coordinates for Mapbox API (longitude,latitude)
      const coordString = `${coordinates.longitude},${coordinates.latitude};${offsetLng},${offsetLat}`;
      
      // Call Mapbox Map Matching API
      // Documentation: https://docs.mapbox.com/api/navigation/map-matching/
      const url = `https://api.mapbox.com/matching/v5/mapbox/driving/${coordString}?access_token=${mapboxToken}&geometries=geojson&radiuses=50;50&steps=false&tidy=false&overview=full`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Map matching failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we got a valid match
      if (data.code !== 'Ok' || !data.matchings || data.matchings.length === 0) {
        console.warn('No road match found, using original coordinates', data);
        return {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          originalLatitude: coordinates.latitude,
          originalLongitude: coordinates.longitude
        };
      }
      
      try {
        // Get the first matched point (the one closest to our original point)
        // Mapbox returns coordinates as [longitude, latitude]
        const matchedPoints = data.matchings[0].geometry.coordinates;
        
        // Use the first point which is the one we want to snap to the road
        const matchedPoint = matchedPoints[0];
        
        console.log('Successfully snapped to road:', {
          original: [coordinates.longitude, coordinates.latitude],
          snapped: matchedPoint
        });
        
        return {
          latitude: matchedPoint[1],  // latitude is second element
          longitude: matchedPoint[0], // longitude is first element
          originalLatitude: coordinates.latitude,
          originalLongitude: coordinates.longitude
        };
      } catch (err) {
        console.error('Error extracting matched point:', err, data);
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
      // Process each coordinate individually to avoid API limitations
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

export default useMapboxMapMatching;
