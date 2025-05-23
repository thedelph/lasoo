/**
 * TradespersonMarker Component
 * Handles the display logic for a tradesperson's markers (van or HQ)
 */

import React from 'react';
import type { Locksmith } from '../../types/locksmith';
import VanMarker from './VanMarker';
import HQMarker from './HQMarker';
import { SnappedPoint } from './utils/mapHelpers';
import { processSpecialCases } from './utils/specialCases';
import { calculateCompanyBearing } from './utils/mapHelpers';

interface TradespersonMarkerProps {
  displayNumber: number;
  locksmith: Locksmith;
  visibleMarkers: Record<string, boolean>;
  roadSnappedPoints: Record<string, SnappedPoint>;
  onMarkerClick: (locksmith: Locksmith) => void;
  isSelected: boolean;
}

const TradespersonMarker: React.FC<TradespersonMarkerProps> = ({ 
  locksmith, 
  visibleMarkers, 
  roadSnappedPoints, 
  onMarkerClick,
  displayNumber,
  isSelected
}) => {
  // Find current location and HQ location
  let currentLocation = locksmith.locations.find(loc => loc.isCurrentLocation);
  let hqLocation = locksmith.locations.find(loc => !loc.isCurrentLocation);
  
  // If no HQ location found but we have coordinates in the main locksmith data
  if (!hqLocation && locksmith.latitude && locksmith.longitude) {
    hqLocation = {
      latitude: locksmith.latitude,
      longitude: locksmith.longitude,
      isCurrentLocation: false
    };
  }
  
  // Process any special cases (like Ant - AntMad)
  const processedLocations = processSpecialCases(locksmith, hqLocation, currentLocation);
  hqLocation = processedLocations.hqLocation;
  currentLocation = processedLocations.currentLocation;
  
  // Default to east-facing (90 degrees)
  let bearing = 90;
  
  // Get bearing from road snapping if available
  const snappedPoint = roadSnappedPoints[`${locksmith.id}-current`];
  if (snappedPoint && typeof snappedPoint.bearing === 'number') {
    // Use the road bearing if available
    bearing = snappedPoint.bearing;
  } else {
    // Fallback: Calculate bearing based on company name + locksmith ID
    // This ensures different tradespeople have different bearings but remain consistent
    const baseBearing = calculateCompanyBearing(locksmith.companyName);
    
    // Use the locksmith ID to create a consistent offset for this specific tradesperson
    const idHash = locksmith.id.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    // Apply the offset to create variation between different tradespeople
    bearing = (baseBearing + (idHash % 360)) % 360;
  }

  // Debug log for van data
  if (currentLocation) {
    const vanMarkerLatitude = snappedPoint?.latitude || currentLocation?.latitude;
    const vanMarkerLongitude = snappedPoint?.longitude || currentLocation?.longitude;
    // Determine the bearing VanMarker will effectively use
    let finalVanBearing = bearing; // This is the bearing from TradespersonMarker's logic
    if (snappedPoint && typeof snappedPoint.bearing === 'number') {
      finalVanBearing = snappedPoint.bearing;
    }

    console.log(`[TradespersonMarker] Van data for ${locksmith.companyName} (${locksmith.id}):`, {
      originalLat: currentLocation.latitude,
      originalLng: currentLocation.longitude,
      snappedPointDetails: snappedPoint, // Contains snapped lat, lng, bearing from API
      bearingCalculatedInTradespersonMarker: bearing, // Bearing after fallback/snapping logic in this component
      // Values VanMarker will actually use:
      finalVanLat: vanMarkerLatitude,
      finalVanLng: vanMarkerLongitude,
      finalVanBearing: finalVanBearing,
      isUsingSnappedBearing: snappedPoint && typeof snappedPoint.bearing === 'number',
      isUsingSnappedLocation: snappedPoint && typeof snappedPoint.latitude === 'number' && typeof snappedPoint.longitude === 'number',
    });
  }
  
  // Check if van marker should be visible (prevent overlap)
  const isVanVisible = visibleMarkers[`${locksmith.id}-van`] !== false;
  
  // Check if HQ marker should be visible (prevent overlap)
  const isHQVisible = visibleMarkers[`${locksmith.id}-hq`] !== false;
  
  return (
    <div key={locksmith.id}>
      {/* Show van marker if it exists and is visible */}
      {currentLocation && isVanVisible && (
        <VanMarker
          locksmith={locksmith}
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          bearing={bearing}
          snappedPoint={snappedPoint}
          onMarkerClick={onMarkerClick}
          displayNumber={displayNumber}
          isSelected={isSelected}
        />
      )}
      
      {/* HQ location (shop icon) - Only show if no live location is shared */}
      {hqLocation && isHQVisible && !currentLocation && (
        <HQMarker
          locksmith={locksmith}
          latitude={hqLocation.latitude}
          longitude={hqLocation.longitude}
          onMarkerClick={onMarkerClick}
          displayNumber={displayNumber}
        />
      )}
    </div>
  );
};

export default TradespersonMarker;
