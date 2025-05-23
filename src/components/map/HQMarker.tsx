/**
 * HQ Marker Component
 * Displays the HQ (shop) location for tradespeople
 */

import React from 'react';
import { Marker } from 'react-map-gl';
import ShopIcon3D from './SimplifiedShopIcon3D';
import type { Locksmith } from '../../types/locksmith';

interface HQMarkerProps {
  displayNumber: number;
  locksmith: Locksmith;
  latitude: number;
  longitude: number;
  onMarkerClick: (locksmith: Locksmith) => void;
}

const HQMarker: React.FC<HQMarkerProps> = ({ 
  locksmith, 
  latitude, 
  longitude, 
  onMarkerClick,
  displayNumber
}) => {
  return (
    <Marker
      key={`${locksmith.id}-hq`}
      latitude={latitude}
      longitude={longitude}
      anchor="bottom"
    >
      <div 
        className="cursor-pointer relative"
        onClick={() => onMarkerClick(locksmith)}
        title={`${locksmith.companyName} (Business Location) - #${displayNumber}`}
      >
        <div 
          className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center z-10 shadow-md"
          style={{ fontSize: '0.6rem', lineHeight: '1' }}
        >
          {displayNumber}
        </div>
        <ShopIcon3D className="h-8 w-8 text-indigo-600" />

      </div>
    </Marker>
  );
};

export default HQMarker;
