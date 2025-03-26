import { useState, useEffect } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { AlertCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ServiceAreaTab() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    service_radius: 10,
    share_location: false,
    postcode: "",
    latitude: null as number | null,
    longitude: null as number | null
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        service_radius: profile.service_radius || 10,
        share_location: profile.share_location || false,
        postcode: profile.postcode || "",
        latitude: profile.latitude,
        longitude: profile.longitude
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.group('Service Area Update');

    try {
      // Get coordinates from postcode using Mapbox
      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) throw new Error('Mapbox token not found');

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          formData.postcode
        )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Invalid postcode');
      }

      const [longitude, latitude] = data.features[0].center;

      // Use the updateProfile function from useProfile hook
      await updateProfile({
        service_radius: formData.service_radius,
        share_location: formData.share_location,
        postcode: formData.postcode,
        latitude,
        longitude,
        updated_at: new Date().toISOString()
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
    }
  };

  if (profileLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="space-y-6">
      {formData.latitude && formData.longitude ? (
        <div className="alert alert-success">
          <MapPin className="h-4 w-4" />
          <span>Current location: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</span>
        </div>
      ) : (
        <div className="alert alert-warning">
          <AlertCircle className="h-4 w-4" />
          <span>No location set. Please enter your business postcode.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Business Postcode</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={formData.postcode}
            onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
            placeholder="e.g., M4 7AZ"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Service Radius: {formData.service_radius} km</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={formData.service_radius}
            onChange={(e) => setFormData(prev => ({ ...prev, service_radius: Number(e.target.value) }))}
            className="range range-primary"
            step={1}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>1km</span>
            <span>25km</span>
            <span>50km</span>
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Share Live Location During Working Hours</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.share_location}
              onChange={(e) => setFormData(prev => ({ ...prev, share_location: e.target.checked }))}
            />
          </label>
          <label className="label">
            <span className="label-text-alt text-warning">
              You must enable this to appear in search results
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full ${saving ? 'loading' : ''}`}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="divider">Debug Information</div>

      <div className="space-y-2 text-sm font-mono">
        <p>Current State:</p>
        <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto">
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
  );
}