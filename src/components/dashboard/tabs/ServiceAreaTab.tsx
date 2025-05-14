import { useState, useEffect } from "react";
import { useSupabaseProfile } from "../../../hooks/useSupabaseProfile";
import { AlertCircle, MapPin, Loader2, Globe, Target, Navigation, Info } from "lucide-react";
import { toast } from "sonner";
import { formatUKPostcode, isValidUKPostcode } from "../../../utils/postcodeUtils";

export default function ServiceAreaTab() {
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile();
  const [saving, setSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service_radius: 10,
    share_location: false,
    postcode: "",
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [postcodeError, setPostcodeError] = useState("");
  const [geocodingAttempted, setGeocodingAttempted] = useState(false);

  // Function to geocode a postcode and get coordinates
  const geocodePostcode = async (postcode: string) => {
    if (!postcode) return null;
    
    try {
      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) throw new Error('Mapbox token not found');

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          postcode
        )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Postcode not found');
      }

      return {
        longitude: data.features[0].center[0],
        latitude: data.features[0].center[1]
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Manually trigger geocoding for a postcode with an option to update the database
  const manualGeocodePostcode = async (postcodeValue: string) => {
    console.log('Manual geocoding triggered for postcode:', postcodeValue);
    
    try {
      const formattedPostcode = formatUKPostcode(postcodeValue);
      if (!isValidUKPostcode(formattedPostcode)) {
        console.error('Invalid postcode format:', formattedPostcode);
        toast.error('Invalid UK postcode format');
        return null;
      }
      
      const coords = await geocodePostcode(formattedPostcode);
      if (!coords) {
        console.error('Geocoding failed for postcode:', formattedPostcode);
        toast.error('Could not find coordinates for this postcode');
        return null;
      }
      
      console.log('Geocoding successful, got coordinates:', coords);
      
      // Update formData with new coordinates
      setFormData(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude
      }));
      
      toast.success('Location coordinates set successfully');
      
      // Return the coordinates in case caller needs them
      return coords;
    } catch (error) {
      console.error('Error in manual geocoding:', error);
      toast.error('Error getting coordinates');
      return null;
    }
  };
  
  // Force geocoding on component load
  // Only do initial geocoding once per component mount
  const [initialGeocodingDone, setInitialGeocodingDone] = useState(false);
  
  useEffect(() => {
    // Skip if we've already done the initial geocoding
    if (initialGeocodingDone) return;
    
    const loadAndGeocode = async () => {
      console.log('Component mounted, profile loaded:', !!profile);
      
      if (!profile) return;
      
      // Initialize form data from profile
      const newFormData = {
        service_radius: profile.service_radius || 10,
        share_location: profile.share_location || false,
        postcode: profile.postcode || "",
        latitude: profile.latitude,
        longitude: profile.longitude
      };
      
      console.log('Setting initial form data:', newFormData);
      setFormData(newFormData);
      
      // Mark that we've done initial geocoding to prevent loops
      setInitialGeocodingDone(true);
      
      // If we already have coordinates, don't geocode
      if (newFormData.latitude && newFormData.longitude) {
        console.log('Coordinates already exist, skipping geocoding');
        return;
      }
      
      // Only geocode if we have a postcode but no coordinates
      if (newFormData.postcode && (!newFormData.latitude || !newFormData.longitude)) {
        console.log('Have postcode but no coordinates, attempting geocoding');
        
        // Get coordinates but don't update the profile in the database
        // Just update the local state to show the success message
        const coords = await manualGeocodePostcode(newFormData.postcode);
        
        if (coords) {
          setFormData(prev => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude
          }));
        }
      }
    };
    
    loadAndGeocode();
  }, [profile, initialGeocodingDone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prevent multiple rapid submissions
    if (saving || isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate submit');
      return;
    }
  
    setIsSubmitting(true);
    setSaving(true);
    console.group('Service Area Update');

    try {
      // Format and validate the postcode first
      const formattedPostcode = formatUKPostcode(formData.postcode);
      
      if (!isValidUKPostcode(formattedPostcode)) {
        throw new Error('Invalid UK postcode format. Please use a valid format (e.g., SW1A 1AA)');
      }
      
      console.log('Submit: Geocoding postcode:', formattedPostcode);
      
      // Get coordinates from postcode using Mapbox
      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) throw new Error('Mapbox token not found');

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          formattedPostcode
        )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Submit: Geocoding response:', data);
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Postcode not found. Please check and try again.');
      }

      const [longitude, latitude] = data.features[0].center;
      console.log('Submit: Got coordinates:', { latitude, longitude });

      // First update the form data to immediately reflect in the UI
      setFormData(prev => ({
        ...prev,
        latitude,
        longitude,
        postcode: formattedPostcode
      }));
      
      // Then update only the profile fields that are actually in the users table
      // The user table doesn't have latitude/longitude fields directly
      // So we just update the postcode and other fields here
      await updateProfile({
        service_radius: formData.service_radius,
        share_location: formData.share_location,
        postcode: formattedPostcode // Use the properly formatted postcode
      });

      setFormData(prev => ({
        ...prev,
        latitude,
        longitude
      }));

      toast.success('Service area settings updated successfully');
    } catch (error) {
      console.error('Error updating service area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update service area');
    } finally {
      console.groupEnd();
      setSaving(false);
      // Add a small delay before allowing new submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading your service area...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Service Area Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Define where you provide your locksmith services and how customers can find you.
        </p>
      </div>

      {/* Location Status Card */}
      <div className="mb-6">
        {formData.latitude && formData.longitude ? (
          <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4">
            <div className="mt-0.5 rounded-full bg-green-100 p-1">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Location Successfully Set</h3>
              <p className="mt-1 text-sm text-green-700">
                Your business is located at coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
              <p className="mt-2 text-xs text-green-600">
                This location will be used to match you with customers in your service area.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="mt-0.5 rounded-full bg-amber-100 p-1">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800">No Location Set</h3>
              <p className="mt-1 text-sm text-amber-700">
                {formData.postcode ? 
                  <>
                    Your postcode <strong>{formData.postcode}</strong> has been saved, but coordinates need to be set. 
                    Click the "Save Location Settings" button to geocode your postcode and set your location.
                  </> : 
                  "Please enter your business postcode to set your location on the map."}
              </p>
              <p className="mt-2 text-xs text-amber-600">
                Without a location, customers won't be able to find your services.
              </p>
              {formData.postcode && (
                <button 
                  type="button"
                  className="mt-2 text-xs font-medium text-amber-800 underline"
                  onClick={() => manualGeocodePostcode(formData.postcode)}
                >
                  Click here to try geocoding again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Settings Card */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Globe className="h-4 w-4 text-slate-500" />
              Business Location
            </h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="postcode" className="block text-sm font-medium text-slate-700">
                  Business Postcode
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="postcode"
                    type="text"
                    className={`w-full rounded-md border pl-10 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 ${postcodeError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'}`}
                    value={formData.postcode}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData(prev => ({ ...prev, postcode: newValue }));
                      // Clear error if field is empty
                      if (!newValue) {
                        setPostcodeError("");
                      }
                    }}
                    onBlur={() => {
                      // Validate on blur if there's content
                      if (formData.postcode) {
                        const formatted = formatUKPostcode(formData.postcode);
                        if (!isValidUKPostcode(formatted)) {
                          setPostcodeError("Please enter a valid UK postcode (e.g., SW1A 1AA)");
                        } else {
                          setPostcodeError("");
                          // Update the field with formatted version
                          setFormData(prev => ({ ...prev, postcode: formatted }));
                        }
                      }
                    }}
                    placeholder="e.g., SW1A 1AA"
                    required
                    disabled={saving}
                  />
                </div>
                {postcodeError && (
                  <p className="mt-1 text-sm text-red-600">{postcodeError}</p>
                )}
                <p className="text-xs text-slate-500">
                  Enter the postcode of your business location
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Radius Card */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Target className="h-4 w-4 text-slate-500" />
              Service Coverage
            </h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="service_radius" className="block text-sm font-medium text-slate-700">
                    Service Radius
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    {formData.service_radius} km
                  </span>
                </div>
                
                <input
                  id="service_radius"
                  type="range"
                  min={1}
                  max={50}
                  value={formData.service_radius}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_radius: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  step={1}
                  disabled={saving}
                />
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1km</span>
                  <span>25km</span>
                  <span>50km</span>
                </div>
                
                <p className="mt-1 text-xs text-slate-500">
                  This determines how far from your business location you're willing to provide services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Sharing Card */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Navigation className="h-4 w-4 text-slate-500" />
              Location Sharing
            </h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-5 items-center">
                  <input
                    id="share_location"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.share_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, share_location: e.target.checked }))}
                    disabled={saving}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="share_location" className="block text-sm font-medium text-slate-700">
                    Share Live Location During Working Hours
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    When enabled, customers can see your real-time location during your working hours.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Info className="h-3 w-3" />
                    <span>You must enable this to appear in search results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Location...
              </>
            ) : (
              'Save Location Settings'
            )}
          </button>
        </div>
      </form>

      {/* Debug Information - Collapsible */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Info className="h-4 w-4 text-slate-500" />
            Debug Information
          </h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-2 text-sm font-mono">
            <p className="text-xs text-slate-500">Current State:</p>
            <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-100 p-4 text-xs text-slate-800">
              {JSON.stringify(
                {
                  profile_id: profile?.id,
                  current: {
                    share_location: profile?.share_location,
                    latitude: profile?.latitude,
                    longitude: profile?.longitude,
                    service_radius: profile?.service_radius,
                    postcode: profile?.postcode,
                  },
                  form: formData
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}