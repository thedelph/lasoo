/**
 * Road snapping utilities for map markers
 * Handles the logic for snapping vehicle markers to roads
 */

import { SnappedPoint, calculateBearing } from './mapHelpers';
import type { Locksmith } from '../../../types/locksmith';

// Function to snap markers to roads using Mapbox Directions API
export async function snapToRoads(
  locations: { id: string; latitude: number; longitude: number }[],
  mapboxToken: string
): Promise<Record<string, SnappedPoint>> {
  const snappedPoints: Record<string, SnappedPoint> = {};

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    try {
      // Original point
      const lon1 = location.longitude;
      const lat1 = location.latitude;

      // Slightly perturbed second point (approx. 1.1m North)
      const offset = 0.00010; // Approx 11.1 meters at UK latitudes
      const lat2 = lat1 + offset;
      const lon2 = lon1; // Keep longitude the same for a clear Northward offset
      
      // Construct the coordinates string for the API call with two slightly different points
      const apiCoordinates = `${lon1},${lat1};${lon2},${lat2}`;
      const endpoint = `https://api.mapbox.com/matching/v5/mapbox/driving/${apiCoordinates}?geometries=geojson&overview=full&waypoints=0;1&radiuses=15;15&access_token=${mapboxToken}`;


      let responseData;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorText = await response.text();
          snappedPoints[location.id] = { ...location, bearing: 0, error: `API request failed: ${response.status}` }; 
          continue;
        }
        responseData = await response.json();

      } catch (error) {
        snappedPoints[location.id] = { ...location, bearing: 0, error: 'Fetch error' }; 
        continue;
      }
      // Process responseData and define variables for bearing calculation
      if (responseData.code !== 'Ok' || !responseData.matchings || responseData.matchings.length === 0) {
        snappedPoints[location.id] = { ...location, bearing: 0, error: `No match: ${responseData.code}` };
        continue;
      }

      const matching = responseData.matchings[0];

      // Extract the snapped coordinates for the *first* waypoint (our original point)
      // The tracepoints array is at the root of the responseData object.
      const originalTracepoint = responseData.tracepoints?.[0];
      if (!originalTracepoint || !originalTracepoint.location || originalTracepoint.location.length < 2) {
        snappedPoints[location.id] = { ...location, bearing: 0, error: 'Snapped original_waypoint not found or invalid' };
        continue;
      }

      const snappedLng = originalTracepoint.location[0];
      const snappedLat = originalTracepoint.location[1];

      if (typeof snappedLat !== 'number' || typeof snappedLng !== 'number') {
        snappedPoints[location.id] = { ...location, bearing: 0, error: 'Invalid snapped_coordinates' };
        continue;
      }

      let bearing: number | undefined = undefined;
      const maneuver = matching.legs?.[0]?.steps?.[0]?.maneuver;

      // 1. Try bearing_after
      if (typeof maneuver?.bearing_after === 'number' && !isNaN(maneuver.bearing_after)) {
        bearing = maneuver.bearing_after;
      }
      // 2. Try bearing_before (if bearing_after failed)
      else if (typeof maneuver?.bearing_before === 'number' && !isNaN(maneuver.bearing_before)) {
        bearing = maneuver.bearing_before;
      }
      // 3. Try calculating from TRACEPOINTS, then STEP, then OVERALL geometry (if maneuver bearings failed)
      else {

        // 3a. Try TRACEPOINTS geometry (using snapped locations of input waypoints)
        const tp0Location = responseData.tracepoints?.[0]?.location; // [lon, lat]
        const tp1IsNull = responseData.tracepoints?.[1] === null;
        const tp1Location = responseData.tracepoints?.[1]?.location; // [lon, lat] or undefined if tp1 is null

        let snappedCoords: [number, number] | null = null;

        if (tp0Location) {
          snappedCoords = [tp0Location[1], tp0Location[0]]; // Prioritize tp0 for snapped coordinates

          if (tp1Location) { // tp1 is not null and has a location
            if (tp0Location[0] !== tp1Location[0] || tp0Location[1] !== tp1Location[1]) {
              bearing = calculateBearing(tp0Location[1], tp0Location[0], tp1Location[1], tp1Location[0]);
            } else {
              const perturbedLonForCalc = location.longitude; // Original longitude for the perturbed point
              const perturbedLatForCalc = location.latitude + offset; // Original latitude + offset for the perturbed point
              bearing = calculateBearing(tp0Location[1], tp0Location[0], perturbedLatForCalc, perturbedLonForCalc);
            }
          } else if (tp1IsNull) { // tp0 is valid, and tp1 is explicitly null
            const perturbedLonForCalc = location.longitude; // Original longitude for the perturbed point
            const perturbedLatForCalc = location.latitude + offset; // Original latitude + offset for the perturbed point

            bearing = calculateBearing(tp0Location[1], tp0Location[0], perturbedLatForCalc, perturbedLonForCalc);
          } else {
            // tp0 is valid, but tp1 is neither a valid location nor explicitly null (e.g. tracepoints array has < 2 elements, or tp1 is undefined after a check for null)
            // Bearing remains 0, will fall through to STEP/OVERALL
          }
        } else {
          // snappedCoords will remain null from this block. The main function has a fallback for snappedCoords if it's still null later.
        }

        // Fallback to STEP/OVERALL geometry if bearing is still 0 AND snappedCoords could be determined (i.e., tp0 was valid)
        if (bearing === 0 && snappedCoords) {
          // 3b. Try STEP geometry (if bearing still undefined)
          const stepGeometryCoords = matching.legs?.[0]?.steps?.[0]?.geometry?.coordinates;
          if (stepGeometryCoords && stepGeometryCoords.length >= 2) {
            const p1 = stepGeometryCoords[0]; // [lon, lat]
            const p2 = stepGeometryCoords[1]; // [lon, lat]
            if (p1[0] !== p2[0] || p1[1] !== p2[1]) { // Check if points are distinct
              bearing = calculateBearing(p1[1], p1[0], p2[1], p2[0]);
            } else {
            }
          } else {
          }
        }

        // 3c. Try OVERALL match geometry (if bearing still undefined)
        if (typeof bearing === 'undefined') {
          const overallGeometryCoords = matching.geometry?.coordinates;
          if (overallGeometryCoords && overallGeometryCoords.length >= 2) {
            const p1 = overallGeometryCoords[0]; // [lon, lat]
            const p2 = overallGeometryCoords[1]; // [lon, lat]
            if (p1[0] !== p2[0] || p1[1] !== p2[1]) { // Check if points are distinct
              bearing = calculateBearing(p1[1], p1[0], p2[1], p2[0]);
            } else {
            }
          } else {
          }
        }
      }
      
      // 5. Final bearing assignment with a default of 0 (North)
      const finalBearing = (typeof bearing === 'number' && !isNaN(bearing)) ? bearing : 0;

      snappedPoints[location.id] = {
        latitude: snappedLat,
        longitude: snappedLng,
        bearing: finalBearing,
      };

    } catch (error: any) {
      snappedPoints[location.id] = { 
        latitude: location.latitude, 
        longitude: location.longitude, 
        bearing: 90, 
        error: `Exception: ${error.message}` 
      };
    }

    // Small delay to avoid rate limiting, placed outside the try-catch if successful or not
    await new Promise(resolve => setTimeout(resolve, 50)); 
  }

  return snappedPoints;
}

// Preprocess locations for road snapping
export function prepareLocationsForSnapping(locksmiths: Locksmith[]): { id: string; latitude: number; longitude: number }[] {
  const locationsToSnap: { id: string; latitude: number; longitude: number }[] = [];

  locksmiths.forEach(locksmith => {
    // Only attempt to snap if we are actually displaying the live location
    if (locksmith.isDisplayingLive && typeof locksmith.latitude === 'number' && typeof locksmith.longitude === 'number') {
      locationsToSnap.push({
        id: `${locksmith.id}-current`, // Keep this ID convention for TradespersonMarker
        latitude: locksmith.latitude,    // These are the (live) coordinates being displayed
        longitude: locksmith.longitude,
      });
    }
  });

  return locationsToSnap;
}
