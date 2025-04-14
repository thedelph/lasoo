/**
 * @file useLocksmiths.ts
 * @description Hook for finding nearby locksmiths based on geographic coordinates.
 * The service searches for tradespeople in the users table with entries in the
 * locations table, measures service radius from HQ location, and returns details
 * about both current and HQ locations.
 */

import { useState } from 'react';
import { supabase } from '../utils/supabase';
import type { Locksmith, Location } from '../types/locksmith';
import { calculateDistance } from '../lib/utils';

/**
 * Database record types used for type safety when interacting with Supabase
 */

/**
 * Represents a user/tradesperson record from the users table
 * Contains business information and service details
 */
interface UserRecord {
  id: number;              // Database primary key
  user_id: string;         // Unique user identifier
  fullname: string;        // Full name of the user/tradesperson
  company_name: string;    // Company or business name
  phone: string;           // Contact phone number
  email: string;           // Contact email address
  company_postcode: string; // HQ/business location postcode
  service_type: string;    // Type of service provided (e.g., "Locksmith")
  location?: LocationRecord; // Optional joined location record
  // Added during processing:
  distance?: number;       // Calculated distance from search location
  hqCoords?: {latitude: number, longitude: number}; // Geocoded HQ coordinates
}

/**
 * Represents a location record from the locations table
 * Contains geographic coordinates for the tradesperson's current location
 */
interface LocationRecord {
  user_id: string;        // Foreign key to user_id in users table
  latitude: string;       // Latitude coordinate as string
  longitude: string;      // Longitude coordinate as string
}

/**
 * Geocodes a UK postcode to latitude/longitude coordinates using the Mapbox API
 * 
 * @param postcode - The UK postcode to geocode (e.g., "M41 9HE")
 * @param mapboxToken - The Mapbox API access token
 * @returns Promise resolving to coordinates object or null if geocoding fails
 */
async function geocodePostcode(postcode: string, mapboxToken: string): Promise<{latitude: number, longitude: number} | null> {
  if (!postcode?.trim()) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(postcode)}.json?country=GB&types=postcode&access_token=${mapboxToken}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) return null;
    
    const [longitude, latitude] = data.features[0].center;
    return { latitude, longitude };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Hook for finding nearby locksmiths based on geographic coordinates
 * 
 * @returns Object containing the findNearby function and loading state
 */
export function useLocksmiths() {
  const [loading, setLoading] = useState(false);
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

  /**
   * Finds nearby locksmiths based on search coordinates and filters
   * 
   * Key features:
   * - Queries users (tradespeople) from the users table
   * - Retrieves their current location from the locations table
   * - Geocodes their HQ location from company_postcode
   * - Measures service radius from HQ location when available
   * - Returns complete Locksmith objects with both locations when available
   * 
   * @param latitude - Latitude of the search location
   * @param longitude - Longitude of the search location
   * @param radiusKm - Radius in kilometers to search within (default: 50km)
   * @param serviceType - Optional service type filter (e.g., "home")
   * @returns Promise resolving to array of Locksmith objects within the radius
   */
  const findNearby = async (
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    serviceType?: string
  ): Promise<Locksmith[]> => {
    setLoading(true);
    console.group('🔍 Locksmith Search');
    
    try {
      console.log('Search Parameters:', {
        searchLocation: { latitude, longitude },
        radiusKm,
        serviceType: serviceType || 'any'
      });

      // Step 1: Query users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(
          'id, user_id, fullname, company_name, phone, email, company_postcode, service_type'
        )
        .eq('is_authorized', 1)
        .eq('is_activated', 1);

      if (usersError) {
        console.error('Users query error:', usersError);
        throw usersError;
      }

      if (!users || users.length === 0) {
        console.log('No active users found');
        return [];
      }

      console.log(`Found ${users.length} active users`);

      // Step 2: Filter by service type if specified
      // Special case: when service_type is 'home', include locksmith services
      // This allows home users to find locksmiths
      const filteredUsers = serviceType && serviceType !== 'any' 
        ? users.filter(user => {
            // If searching for 'home', include all locksmith services
            if (serviceType.toLowerCase() === 'home') {
              return user.service_type?.toLowerCase() === 'locksmith';
            }
            // Otherwise, match exactly
            return user.service_type === serviceType;
          })
        : users;

      console.log(`After service type filtering: ${filteredUsers.length} users`);
      
      if (filteredUsers.length === 0) {
        console.log(`No users found with service type: ${serviceType}`);
        return [];
      }

      // Extract user_ids for the locations query
      const userIds = filteredUsers.map(user => user.user_id);

      // Step 3: Query locations table
      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('user_id, latitude, longitude')
        .in('user_id', userIds)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (locationsError) {
        console.error('Locations query error:', locationsError);
        throw locationsError;
      }

      if (!locations || locations.length === 0) {
        console.log('No location data found for users');
        return [];
      }

      console.log(`Found ${locations.length} location entries`);

      // Step 4: Join users and locations manually
      const usersWithLocations: UserRecord[] = filteredUsers.map(user => {
        const userLocation = locations.find(
          location => location.user_id === user.user_id
        );
        return { ...user, location: userLocation };
      }).filter((user): user is UserRecord & { location: LocationRecord } => !!user.location);

      console.log(`Found ${usersWithLocations.length} users with valid locations`);

      // Log the search coordinates
      console.log(`Search coordinates: ${latitude}, ${longitude}`);
      
      // We'll need to geocode HQ locations first to determine if they're in range
      const usersWithHQPromises = await Promise.all(
        usersWithLocations.map(async user => {
          if (!user.location) {
            console.log(`${user.company_name}: No location data`);
            return { user, inRange: false, distance: null, hqCoords: null };
          }
          
          // Current location data
          const currentLat = Number(user.location.latitude);
          const currentLng = Number(user.location.longitude);
          
          // By default, measure from current location
          let measureLat = currentLat;
          let measureLng = currentLng;
          let hqCoords = null;
          
          // If company postcode exists, try to geocode it to use as HQ
          if (user.company_postcode) {
            try {
              const geocoded = await geocodePostcode(user.company_postcode, mapboxToken);
              
              if (geocoded) {
                console.log(`HQ location for ${user.company_name}: ${geocoded.latitude}, ${geocoded.longitude}`);
                // Use HQ coordinates for distance measurement
                measureLat = geocoded.latitude;
                measureLng = geocoded.longitude;
                hqCoords = geocoded;
              }
            } catch (error) {
              console.error(`Failed to geocode HQ for ${user.company_name}:`, error);
            }
          }
          
          // Calculate distance from search location to measurement point (HQ if available, otherwise current)
          const distance = calculateDistance(
            latitude,
            longitude,
            measureLat,
            measureLng
          );

          // Check if the search location is within the service radius
          const inRange = distance <= radiusKm;
          console.log(`${user.company_name}: Distance=${distance.toFixed(2)}km from ${hqCoords ? 'HQ' : 'current'} location, Radius=${radiusKm}km - ${inRange ? 'IN RANGE' : 'OUT OF RANGE'}`);
          
          return { user, inRange, distance, hqCoords };
        })
      );
      
      // Filter users that are in range
      const inRangeUsers = usersWithHQPromises
        .filter(result => result.inRange)
        .map(result => ({
          ...result.user,
          distance: result.distance,
          hqCoords: result.hqCoords
        }));

      // Step 6: Map to Locksmith type with multiple locations
      const locksmithPromises = inRangeUsers.map(async user => {
        // Current location from locations table
        const currentLocation: Location = {
          latitude: Number(user.location!.latitude),
          longitude: Number(user.location!.longitude),
          isCurrentLocation: true
        };
        
        // Store all locations in an array
        const locations: Location[] = [currentLocation];
        
        // We already have the distance calculated from HQ or current location
        const distance = user.distance || 0;
        
        // If we have HQ coordinates from previous step, add them
        if (user.hqCoords) {
          // Add HQ location
          locations.push({
            latitude: user.hqCoords.latitude,
            longitude: user.hqCoords.longitude,
            isCurrentLocation: false // This is HQ, not current location
          });
          console.log(`Using pre-calculated HQ location for ${user.company_name}`);
        }
        // Otherwise try to geocode it again if needed
        else if (user.company_postcode) {
          try {
            const hqCoords = await geocodePostcode(user.company_postcode, mapboxToken);
            
            if (hqCoords) {
              // Check if HQ location is different from current location
              const isDifferentLocation = 
                Math.abs(hqCoords.latitude - currentLocation.latitude) > 0.001 || 
                Math.abs(hqCoords.longitude - currentLocation.longitude) > 0.001;
              
              if (isDifferentLocation) {
                // Add HQ location
                locations.push({
                  latitude: hqCoords.latitude,
                  longitude: hqCoords.longitude,
                  isCurrentLocation: false // This is HQ, not current location
                });
                console.log(`Added HQ location for ${user.company_name}: ${hqCoords.latitude}, ${hqCoords.longitude}`);
              }
            }
          } catch (error) {
            console.error(`Failed to geocode HQ for ${user.company_name}:`, error);
          }
        }
        
        return {
          id: String(user.id),
          companyName: user.company_name || 'Unknown Company',
          telephoneNumber: user.phone || '',
          website: undefined, // We don't have website information
          servicesOffered: [user.service_type || 'Locksmith'],
          // Use current location as primary coordinates
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          // Store all locations
          locations: locations,
          // Store distance from search location
          distance: distance,
          // Store HQ postcode for reference
          hqPostcode: user.company_postcode,
          serviceRadius: radiusKm, // Default service radius
          eta: Math.round(distance * 2 + 10)
        };
      });

      // Wait for all promises to resolve
      const locksmiths = await Promise.all(locksmithPromises);
      
      console.log(`Returning ${locksmiths.length} locksmiths`);
      return locksmiths;

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  return { findNearby, loading };
}