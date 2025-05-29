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
  service_radius?: number; // Service radius in kilometers
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
  date_updated?: string;  // Timestamp of when the location was last updated (ISO string)
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
type ProcessedUser = UserRecord & { 
  distance?: number; 
  hqCoords?: { latitude: number; longitude: number }; 
  location?: LocationRecord | null; 
};

export function useLocksmiths(passedMapboxToken?: string | null) {
  const [loading, setLoading] = useState(false); // 'loading' state is returned for consumer, not used internally after set.
  const mapboxToken = passedMapboxToken || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

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
   * @param locationMode - Optional location mode filter (e.g., "current", "hq", "either")
   * @returns Promise resolving to array of Locksmith objects within the radius
   */
  const findNearby = async (
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    serviceType?: string,
    locationMode: 'current' | 'hq' | 'either' = 'either'
  ): Promise<Locksmith[]> => {
    setLoading(true);
    console.group('🔍 Locksmith Search');
    
    try {
      console.log('Search Parameters:', {
        searchLocation: { latitude, longitude },
        radiusKm,
        serviceType: serviceType || 'any',
        locationMode
      });

      // Step 1: Query users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(
          'id, user_id, fullname, company_name, phone, email, company_postcode, service_type, service_radius'
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
        .select('user_id, latitude, longitude, date_updated')
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

      // Step 4: Join users and locations manually, but don't filter out users without locations
      // This allows finding locksmiths by their HQ location (company_postcode) even if they're not sharing live location
      const usersWithLocations: UserRecord[] = filteredUsers.map(user => {
        const userLocation = locations.find(
          location => location.user_id === user.user_id
        );
        return { ...user, location: userLocation };
      });

      console.log(`Found ${usersWithLocations.length} users with valid locations`);

      // Log the search coordinates
      console.log(`Search coordinates: ${latitude}, ${longitude}`);
      
      // We'll need to geocode HQ locations first to determine if they're in range
      const usersWithHQPromises = await Promise.all(
        usersWithLocations.map(async user => {
          // If user has no location data but has a company_postcode, we can still show them
          // using just their HQ location
          if (!user.location && !user.company_postcode) {
            console.log(`${user.company_name}: No location data and no company_postcode`);
            return { user, inRange: false, distance: null, hqCoords: null };
          }
          
          // Default measurement coordinates
          let measureLat: number | null = null;
          let measureLng: number | null = null;
          let hqCoords = null;
          
          // If we have current location data, store it
          if (user.location) {
            const currentLat = Number(user.location.latitude);
            const currentLng = Number(user.location.longitude);
            
            // Initialize measurement point with current location
            measureLat = currentLat;
            measureLng = currentLng;
          }
          
          // If company postcode exists, try to geocode it to use as HQ
          if (user.company_postcode) {
            try {
              const geocoded = await geocodePostcode(user.company_postcode, mapboxToken!); // mapboxToken should be ensured by calling context or default
              
              if (geocoded) {
                console.log(`HQ location for ${user.company_name}: ${geocoded.latitude}, ${geocoded.longitude}`);
                // Use HQ coordinates for distance measurement
                // This overrides current location as the measurement point
                // because we want to measure service radius from HQ
                measureLat = geocoded.latitude;
                measureLng = geocoded.longitude;
                hqCoords = geocoded;
              }
            } catch (error) {
              console.error(`Failed to geocode HQ for ${user.company_name}:`, error);
            }
          }
          
          // If we don't have valid measurement coordinates, this locksmith can't be included
          if (measureLat === null || measureLng === null) {
            // Use the user's actual service radius for display, falling back to radiusKm if needed
            const serviceRadius = user.service_radius || radiusKm;
            
            let distance: number | null = null;
            let inRange = false;
            
            // Calculate distance from search point to HQ location
            const hqLocation = await geocodePostcode(user.company_postcode, mapboxToken);
            const hqDistance = calculateDistance(
              latitude,
              longitude,
              hqLocation?.latitude || 0,
              hqLocation?.longitude || 0
            );
            
            // IMPORTANT: For a locksmith to be included, their HQ must be within service radius
            // This follows the principle that service radius is measured from HQ
            inRange = hqDistance <= serviceRadius;
            console.log(`${user.company_name}: Distance=${hqDistance.toFixed(2)}km from HQ location, Radius=${serviceRadius}km - ${inRange ? 'IN RANGE' : 'OUT OF RANGE'}`);
            
            return { user, inRange, distance, hqCoords: hqLocation };
          }
          
          // Calculate distance from search location to measurement point (HQ if available, otherwise current)
          const distance = calculateDistance(
            latitude,
            longitude,
            measureLat,
            measureLng
          );

          // Get the user's actual service radius, not the default search radius
          const serviceRadius = user.service_radius || radiusKm;
          
          // Check if the search location is within the locksmith's service radius
          const inRange = distance <= serviceRadius;
          console.log(`${user.company_name}: Using locksmith's defined service radius: ${serviceRadius}km`);
          console.log(`${user.company_name}: Distance=${distance.toFixed(2)}km from ${hqCoords ? 'HQ' : 'current'} location, Radius=${serviceRadius}km - ${inRange ? 'IN RANGE' : 'OUT OF RANGE'}`);
          
          return { user, inRange, distance, hqCoords };
        })
      );
      
      // Filter users that are in range
      const inRangeUsers = usersWithHQPromises
        .filter(result => result.inRange)
        .map(result => ({
          ...result.user,
          distance: result.distance === null ? undefined : result.distance,
          hqCoords: result.hqCoords === null ? undefined : result.hqCoords
        }));

      // Step 6: Map to Locksmith type with multiple locations and time-based logic
      const locksmithPromises = inRangeUsers.map(async (user: ProcessedUser) => {
        const allLocationsForLocksmith: Location[] = [];

        let displayLat: number;
        let displayLng: number;
        let statusText: string;
        let actualLiveLatitude: number | undefined;
        let actualLiveLongitude: number | undefined;
        let actualLiveLocationTimestamp: string | undefined;
        let isCurrentlyDisplayingLive = false;

        const hqGeocoded: { latitude: number; longitude: number } | undefined = user.hqCoords;

        // Add HQ location to allLocationsForLocksmith if available
        if (hqGeocoded) {
          allLocationsForLocksmith.push({
            latitude: hqGeocoded.latitude,
            longitude: hqGeocoded.longitude,
            isCurrentLocation: false,
            // date_updated is not applicable for HQ from geocoding
          });
        }

        const liveLocationRecord = user.location; // This is LocationRecord, now with date_updated

        if (liveLocationRecord && liveLocationRecord.latitude && liveLocationRecord.longitude && liveLocationRecord.date_updated) {
          actualLiveLatitude = Number(liveLocationRecord.latitude);
          actualLiveLongitude = Number(liveLocationRecord.longitude);
          actualLiveLocationTimestamp = liveLocationRecord.date_updated;

          // Add live location to allLocationsForLocksmith, now including date_updated
          allLocationsForLocksmith.push({
            latitude: actualLiveLatitude,
            longitude: actualLiveLongitude,
            isCurrentLocation: true,
            date_updated: actualLiveLocationTimestamp,
          });

          try {
            const locationDate = new Date(actualLiveLocationTimestamp);
            const now = new Date(); // Current time at execution
            const ageInMinutes = (now.getTime() - locationDate.getTime()) / (1000 * 60);

            if (ageInMinutes <= 15) {
              displayLat = actualLiveLatitude;
              displayLng = actualLiveLongitude;
              statusText = `Live @ ${locationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
              isCurrentlyDisplayingLive = true;
            } else {
              // Live location is older than 15 minutes. Format the timestamp for statusText.
              isCurrentlyDisplayingLive = false;

              let formattedLastUpdate: string;
              // 'locationDate' and 'now' are defined in the outer scope (lines 343-344)
              const lastUpdateDayStart = new Date(locationDate.getFullYear(), locationDate.getMonth(), locationDate.getDate()).getTime();
              const todayDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              const yesterdayDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();

              if (lastUpdateDayStart === todayDayStart) {
                formattedLastUpdate = locationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
              } else if (lastUpdateDayStart === yesterdayDayStart) {
                formattedLastUpdate = 'YESTERDAY';
              } else {
                const diffDays = Math.floor((todayDayStart - lastUpdateDayStart) / (1000 * 60 * 60 * 24));
                if (diffDays < 7) {
                  formattedLastUpdate = locationDate.toLocaleDateString([], { weekday: 'short' }).toUpperCase();
                } else {
                  const day = locationDate.getDate();
                  const month = locationDate.toLocaleDateString([], { month: 'short' }).toUpperCase();
                  formattedLastUpdate = `${day} ${month}`;
                }
              }
              
              statusText = `LAST LIVE ${formattedLastUpdate}`;

              // Set displayLat/Lng: prefer HQ, fallback to stale live coordinates
              if (hqGeocoded) {
                displayLat = hqGeocoded.latitude;
                displayLng = hqGeocoded.longitude;
              } else {
                displayLat = actualLiveLatitude; 
                displayLng = actualLiveLongitude;
              }
            }
          } catch (e) { // Error parsing live location timestamp
            console.error(`Error parsing date_updated '${actualLiveLocationTimestamp}' for user ${user.user_id}:`, e);
            if (hqGeocoded) {
              displayLat = hqGeocoded.latitude;
              displayLng = hqGeocoded.longitude;
              statusText = `Showing HQ (Live data error)`;
              isCurrentlyDisplayingLive = false;
            } else {
              // Fallback to live coords if available, even with date error, if no HQ
              displayLat = actualLiveLatitude;
              displayLng = actualLiveLongitude;
              statusText = `Live (Data error, HQ N/A)`;
              isCurrentlyDisplayingLive = false; 
            }
          } // End of catch
      } else { // No liveLocationRecord (or it was incomplete initially)
        if (hqGeocoded) {
          displayLat = hqGeocoded.latitude;
          displayLng = hqGeocoded.longitude;
          statusText = `Showing HQ (Not Sharing Live)`;
          isCurrentlyDisplayingLive = false;
        } else {
          displayLat = 0; 
          displayLng = 0;
          statusText = 'Location Unavailable';
          isCurrentlyDisplayingLive = false;
          console.warn(`User ${user.user_id} (${user.company_name}) has no live record and no HQ location.`);
        }
      } // End of if (liveLocationRecord && liveLocationRecord.latitude && liveLocationRecord.longitude) else block

        // Deduplicate locations in allLocationsForLocksmith (e.g. if live and HQ are identical after processing)
        const uniqueLocations = Array.from(new Map(allLocationsForLocksmith.map(loc => [`${loc.latitude}_${loc.longitude}_${loc.isCurrentLocation}`, loc])).values());

        return {
          id: String(user.id),
          companyName: user.company_name || 'Unknown Company',
          telephoneNumber: user.phone || '',
          website: undefined, 
          servicesOffered: [user.service_type || 'Locksmith'],
          
          latitude: displayLat,  // Primary display latitude
          longitude: displayLng, // Primary display longitude
          
          locations: uniqueLocations, // All available locations (current + HQ) with timestamps if applicable
          
          distance: user.distance || 0,
          hqPostcode: user.company_postcode,
          serviceRadius: user.service_radius || radiusKm, // Use actual service radius
          eta: Math.round((user.distance || 0) * 2 + 10),

          // New fields from locksmith.ts type update
          liveLatitude: actualLiveLatitude,
          liveLongitude: actualLiveLongitude,
          liveLocationUpdatedAt: actualLiveLocationTimestamp,
          locationStatus: statusText,
          isDisplayingLive: isCurrentlyDisplayingLive,
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