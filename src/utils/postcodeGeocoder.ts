/**
 * @file postcodeGeocoder.ts
 * @description Utility functions for converting UK postcodes to coordinates
 * Includes a hardcoded fallback for common postcodes to ensure map pins appear
 * even when external geocoding services fail
 */

/**
 * Map of known postcodes to their coordinates
 * This ensures that certain tradespeople (like Ant - AntMad) have
 * valid coordinates even if their database values are NULL
 */
export const KNOWN_POSTCODES: Record<string, {lat: number, lng: number}> = {
  // Known postcodes for specific tradespeople
  'M33 5HW': {lat: 53.4032, lng: -2.3231}, // Ant - AntMad's postcode
  'M41 9HE': {lat: 53.4512, lng: -2.3650}  // Example postcode
};

/**
 * Fallback area coordinates based on the postcode prefix
 * Used when a specific postcode isn't in the known list
 */
export const AREA_COORDINATES: Record<string, {lat: number, lng: number}> = {
  // UK cities and postal districts
  'M': {lat: 53.4808, lng: -2.2426},    // Manchester
  'L': {lat: 53.4084, lng: -2.9916},    // Liverpool
  'B': {lat: 52.4862, lng: -1.8904},    // Birmingham
  'S': {lat: 53.3811, lng: -1.4701},    // Sheffield
  'LS': {lat: 53.8008, lng: -1.5491}    // Leeds
};

/**
 * Gets coordinates for a UK postcode, using fallbacks if needed
 * 
 * @param postcode UK postcode (e.g., "M33 5HW")
 * @returns Coordinates object with latitude and longitude, or null if no match
 */
export function getPostcodeCoordinates(postcode: string): {latitude: number, longitude: number} | null {
  if (!postcode) return null;
  
  // 1. Try known postcodes lookup first (exact match)
  const knownCoords = KNOWN_POSTCODES[postcode];
  if (knownCoords) {
    return {
      latitude: knownCoords.lat,
      longitude: knownCoords.lng
    };
  }
  
  // 2. Try area lookup based on prefix (first part of postcode)
  const prefix = postcode.split(' ')[0];
  const areaCoords = AREA_COORDINATES[prefix];
  if (areaCoords) {
    return {
      latitude: areaCoords.lat,
      longitude: areaCoords.lng
    };
  }
  
  // No match found
  return null;
}
