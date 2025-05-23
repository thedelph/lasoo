/**
 * Search Pin Component
 * Displays the pin for the searched postcode location
 */

import React from 'react';
import { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';

interface SearchPinProps {
  latitude: number;
  longitude: number;
}

const SearchPin: React.FC<SearchPinProps> = ({ latitude, longitude }) => {
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="bottom"
    >
      <MapPin className="h-8 w-8 text-blue-600 animate-bounce" />
    </Marker>
  );
};

export default SearchPin;
