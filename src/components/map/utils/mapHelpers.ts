/**
 * Map utility functions
 */

// Helper function to calculate bearing between two coordinates
export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Convert to radians
  const startLat = lat1 * Math.PI / 180;
  const startLng = lon1 * Math.PI / 180;
  const destLat = lat2 * Math.PI / 180;
  const destLng = lon2 * Math.PI / 180;

  // Calculate bearing
  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360; // Normalize to 0-360
  
  return bearing;
};

// Calculate a bearing based on company name for consistent direction
export const calculateCompanyBearing = (companyName: string): number => {
  // Calculate a hash from the company name
  const companyNameHash = companyName.split('').reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  );
  
  // Use the hash to generate a bearing between 0-359
  return companyNameHash % 360;
};

// Define types
export type SnappedPoint = {
  latitude: number;
  longitude: number;
  bearing?: number;
  error?: string; // Optional error message for debugging snapping issues
};

export type TradesPersonMarker = {
  id: string;
  latitude: number;
  longitude: number;
  bearing: number;
  companyName: string;
  visible: boolean;  // Whether this marker should be visible or hidden due to overlap
  isVan: boolean;    // Whether this is a van (true) or HQ (false)
  priority: number;  // Priority for display (higher = more likely to be shown)
};

export type LocationData = {
  latitude: number;
  longitude: number;
  isCurrentLocation: boolean;
};

// Store previous locations for each tradesperson
export const previousLocations: Record<string, {latitude: number, longitude: number}> = {};
