import { useState, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl, Popup, MapRef } from 'react-map-gl';
import { supabase } from '../../lib/supabase/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Building2 } from 'lucide-react';

interface Tradesperson {
  id: string;
  user_id: string;
  fullname: string;
  company_name?: string;
  service_type: string;
  latitude: number;
  longitude: number;
  is_sharing_location: boolean;
  service_radius: number;
  last_active: string;
  profile_image_url?: string;
  company_postcode?: string;
  base_latitude?: number;
  base_longitude?: number;
}

interface Location {
  user_id: string;
  latitude: number;
  longitude: number;
  date_updated: string;
}

const GodModeMap = () => {
  const [tradespeople, setTradespeople] = useState<Tradesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTradesperson, setSelectedTradesperson] = useState<Tradesperson | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -2.2, // Default to UK
    latitude: 53.5,
    zoom: 7
  });
  const mapRef = useRef<MapRef>(null);

  // Filter states
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [availableServiceTypes, setAvailableServiceTypes] = useState<string[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiY2hyaXNoaWRlODciLCJhIjoiY2x0cTVlbDZwMDFtZjJrcGF5ZjQzaGdvNiJ9.KlrS3UlxJE_NHzYJc2f6Vw';

  useEffect(() => {
    fetchTradespeople();
    
    // Set up real-time subscription for location updates
    const tradespeopleSubscription = supabase
      .channel('tradesperson-location-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'locations' 
        }, 
        (payload) => {
          // Update the tradesperson's location in the state
          setTradespeople(current => 
            current.map(tp => 
              tp.user_id === payload.new.user_id 
                ? { ...tp, latitude: payload.new.latitude, longitude: payload.new.longitude, last_active: payload.new.date_updated }
                : tp
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tradespeopleSubscription);
    };
  }, []);

  // Function to convert UK postcode to lat/lng coordinates
  const fetchPostcodeCoordinates = async (postcode: string) => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.status === 200 && data.result) {
        return {
          latitude: data.result.latitude,
          longitude: data.result.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching postcode coordinates:', error);
      return null;
    }
  };

  const fetchTradespeople = async () => {
    try {
      setLoading(true);
      
      // First, fetch all tradesperson users (users with a service_type)
      const { data: tradespeopleData, error: tradespeopleError } = await supabase
        .from('users')
        .select(`
          id,
          user_id,
          fullname,
          company_name,
          service_type,
          company_postcode
        `)
        .not('service_type', 'is', null);
      
      if (tradespeopleError) throw tradespeopleError;
      
      if (!tradespeopleData || tradespeopleData.length === 0) {
        setTradespeople([]);
        setLoading(false);
        return;
      }
      
      // Extract user IDs for the location query
      const userIds = tradespeopleData.map(user => user.user_id);
      
      // Then, fetch locations for these users
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select(`
          user_id,
          latitude,
          longitude,
          date_updated
        `)
        .in('user_id', userIds);
      
      if (locationsError) throw locationsError;
      
      // Create a lookup object for locations
      const locationLookup: Record<string, Location> = {};
      if (locationsData) {
        locationsData.forEach(location => {
          locationLookup[location.user_id] = location;
        });
      }
      
      // Process each tradesperson and fetch base coordinates for those with postcodes
      const formattedDataPromises = tradespeopleData.map(async (user) => {
        const location = locationLookup[user.user_id];
        let baseCoordinates = null;
        
        // If there's a company postcode, try to get its coordinates
        if (user.company_postcode) {
          baseCoordinates = await fetchPostcodeCoordinates(user.company_postcode);
        }
        
        return {
          id: user.id,
          user_id: user.user_id,
          fullname: user.fullname || 'Unknown',
          company_name: user.company_name,
          service_type: user.service_type || 'General',
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          is_sharing_location: !!location, // If location exists, they're sharing
          service_radius: 5, // Default radius in km
          last_active: location?.date_updated || '',
          profile_image_url: undefined, // No profile image in the schema
          company_postcode: user.company_postcode,
          base_latitude: baseCoordinates?.latitude,
          base_longitude: baseCoordinates?.longitude
        };
      });
      
      // Wait for all postcode lookups to complete
      const formattedData = await Promise.all(formattedDataPromises);
      setTradespeople(formattedData);
      
      // Extract unique service types for filtering
      const serviceTypes = [...new Set(tradespeopleData
        .map(user => user.service_type)
        .filter(Boolean))];
      setAvailableServiceTypes(serviceTypes as string[]);
      
    } catch (err: any) {
      console.error('Error fetching tradespeople:', err);
      setError(err.message || 'Failed to load tradespeople data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTradespeople = () => {
    return tradespeople.filter(tp => {
      // Filter by sharing location status if needed
      if (showOnlyActive && !tp.is_sharing_location) {
        return false;
      }
      
      // Filter by service type if not set to 'all'
      if (serviceTypeFilter !== 'all' && tp.service_type !== serviceTypeFilter) {
        return false;
      }
      
      return true;
    });
  };

  const handleMarkerClick = (tradesperson: Tradesperson) => {
    setSelectedTradesperson(tradesperson);
  };

  const formatLastActive = (lastActiveStr: string) => {
    if (!lastActiveStr) return 'Unknown';
    
    const lastActive = new Date(lastActiveStr);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const handleMapError = (e: any) => {
    console.error('Map error:', e);
    setError(e.error?.message || 'Failed to load map');
  };

  const handleMapLoad = () => {
    console.log('Map loaded successfully');
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2 max-w-md">
          <AlertCircle className="h-5 w-5" />
          <span>Map configuration error: Missing access token</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Show Only Active
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle"
                checked={showOnlyActive}
                onChange={() => setShowOnlyActive(!showOnlyActive)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                  showOnlyActive ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
          
          <div>
            <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              id="service-type"
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Service Types</option>
              {availableServiceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="ml-auto">
            <span className="text-sm text-gray-500">
              Showing {getFilteredTradespeople().length} of {tradespeople.length} tradespeople
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow relative">
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          attributionControl={true}
          reuseMaps
          onError={handleMapError}
          onLoad={handleMapLoad}
        >
          <NavigationControl position="top-right" />
          
          {/* Current location markers for all tradespeople */}
          {getFilteredTradespeople().map(tp => (
            <Marker
              key={tp.id}
              longitude={tp.longitude}
              latitude={tp.latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(tp);
              }}
            >
              <div className="relative">
                <div 
                  className={`w-6 h-6 rounded-full ${tp.is_sharing_location ? 'bg-blue-600' : 'bg-gray-400'} cursor-pointer flex items-center justify-center text-white text-sm font-medium shadow-md`} 
                >
                  {tp.fullname.charAt(0)}
                </div>
                {tp.is_sharing_location && (
                  <div className="absolute -inset-1 bg-blue-500 rounded-full opacity-30 animate-ping" />
                )}
              </div>
            </Marker>
          ))}
          
          {/* Base location marker for selected tradesperson */}
          {selectedTradesperson && selectedTradesperson.base_latitude && selectedTradesperson.base_longitude && (
            <Marker
              longitude={selectedTradesperson.base_longitude}
              latitude={selectedTradesperson.base_latitude}
              anchor="bottom"
            >
              <div className="text-indigo-700">
                <Building2 className="h-6 w-6" />
              </div>
            </Marker>
          )}
          
          {/* Popup for selected tradesperson */}
          {selectedTradesperson && (
            <Popup
              longitude={selectedTradesperson.longitude}
              latitude={selectedTradesperson.latitude}
              anchor="bottom"
              onClose={() => setSelectedTradesperson(null)}
              closeButton={true}
              closeOnClick={false}
              className="z-10"
            >
              <div className="p-2 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-semibold">
                      {selectedTradesperson.fullname.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedTradesperson.fullname}</h3>
                    {selectedTradesperson.company_name && (
                      <p className="text-sm text-gray-500">{selectedTradesperson.company_name}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Service:</span> {selectedTradesperson.service_type}</p>
                  <p><span className="font-medium">Service Radius:</span> {selectedTradesperson.service_radius} km</p>
                  
                  {selectedTradesperson.base_latitude && selectedTradesperson.base_longitude && (
                    <p className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-indigo-700" />
                      <span className="font-medium">Distance from base:</span> 
                      {calculateDistance(
                        selectedTradesperson.latitude, 
                        selectedTradesperson.longitude, 
                        selectedTradesperson.base_latitude, 
                        selectedTradesperson.base_longitude
                      )?.toFixed(1)} km
                    </p>
                  )}
                  
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 ${selectedTradesperson.is_sharing_location ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedTradesperson.is_sharing_location ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  {selectedTradesperson.is_sharing_location && (
                    <p><span className="font-medium">Last Active:</span> {formatLastActive(selectedTradesperson.last_active)}</p>
                  )}
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};

export default GodModeMap;
