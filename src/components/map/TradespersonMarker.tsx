/**
 * TradespersonMarker Component
 * Handles the display logic for a tradesperson's markers (van or HQ)
 */

import React from 'react';
import type { Locksmith } from '../../types/locksmith';
import VanMarker from './VanMarker';
import HQMarker from './HQMarker';
import { SnappedPoint } from './utils/mapHelpers';
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
  let bearing = 90; // Default bearing
  const snappedPoint = roadSnappedPoints[`${locksmith.id}-current`]; // Key used in prepareLocationsForSnapping

  if (locksmith.isDisplayingLive) {
    // Calculate bearing for live (van) marker
    if (snappedPoint && typeof snappedPoint.bearing === 'number') {
      bearing = snappedPoint.bearing;
    } else {
      const baseBearing = calculateCompanyBearing(locksmith.companyName);
      const idHash = locksmith.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      bearing = (baseBearing + (idHash % 360)) % 360;
    }

  }
  
  // Visibility checks (keys might need to align with NewMapView's logic if it changes)
  const isVanMarkerVisible = locksmith.isDisplayingLive && visibleMarkers[`${locksmith.id}-van`] !== false;
  const isHQMarkerVisible = !locksmith.isDisplayingLive && visibleMarkers[`${locksmith.id}-hq`] !== false;

  return (
    <div key={locksmith.id}>
      {isVanMarkerVisible && (
        <VanMarker
          locksmith={locksmith}
          latitude={locksmith.latitude} // This is the live location
          longitude={locksmith.longitude}
          bearing={bearing}
          snappedPoint={snappedPoint}
          onMarkerClick={onMarkerClick}
          displayNumber={displayNumber}
          isSelected={isSelected}
        />
      )}
      
      {isHQMarkerVisible && (
        <HQMarker
          locksmith={locksmith}
          latitude={locksmith.latitude} // This is the HQ location
          longitude={locksmith.longitude}
          onMarkerClick={onMarkerClick}
          displayNumber={displayNumber}
        />
      )}
    </div>
  );
};

export default TradespersonMarker;
