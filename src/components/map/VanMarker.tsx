/**
 * Van Marker Component
 * Displays the current (live) location for tradespeople
 */

import React from 'react';
import { Marker } from 'react-map-gl';
import VanIcon3D from './SimplifiedVanIcon3D';
import type { Locksmith } from '../../types/locksmith';
import { SnappedPoint } from './utils/mapHelpers';

interface VanMarkerProps {
  displayNumber: number;
  locksmith: Locksmith;
  latitude: number;
  longitude: number;
  bearing: number;
  snappedPoint?: SnappedPoint;
  onMarkerClick: (locksmith: Locksmith) => void;
}

const VanMarker: React.FC<VanMarkerProps> = ({ 
  locksmith, 
  latitude, 
  longitude, 
  bearing,
  snappedPoint,
  onMarkerClick,
  displayNumber
}) => {
  // Use snapped coordinates if available
  const finalLatitude = snappedPoint?.latitude || latitude;
  const finalLongitude = snappedPoint?.longitude || longitude;
  const finalBearing = snappedPoint?.bearing || bearing;

  return (
    <Marker
      key={`${locksmith.id}-current`}
      latitude={finalLatitude}
      longitude={finalLongitude}
      anchor="center"
    >
      <div 
        className="cursor-pointer relative"
        onClick={() => onMarkerClick(locksmith)}
        title={`${locksmith.companyName} (Live Location) - #${displayNumber}`}
      >
        <div 
          className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center z-10 shadow-md"
          style={{ fontSize: '0.6rem', lineHeight: '1' }}
        >
          {displayNumber}
        </div>
        {/* Create a completely new instance of the van for each tradesperson */}
        {/* Use locksmith.id in key to force unique instances */}
        <div key={`van-container-${locksmith.id}`}>
          <VanIcon3D 
            className="h-10 w-10"
            bearing={finalBearing} 
            animate={true}
            // Force new component on bearing change
            key={`van-icon-${locksmith.id}-${finalBearing}`}
          />
        </div>
      </div>
    </Marker>
  );
};

export default VanMarker;
