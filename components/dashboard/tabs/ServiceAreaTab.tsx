'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { useGeocoding } from '@/hooks/useGeocoding';
import { AlertCircle, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import ServiceAreaDebug from '../ServiceAreaDebug';

export default function ServiceAreaTab() {
  const { profile, loading: profileLoading } = useProfile();
  const { geocodePostcode, loading: geocoding } = useGeocoding();
  const [radius, setRadius] = useState(profile?.service_radius || 10);
  const [shareLocation, setShareLocation] = useState(
    profile?.share_location || false
  );
  const [postcode, setPostcode] = useState(profile?.postcode || '');
  const [saving, setSaving] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Load initial values when profile is available
  useEffect(() => {
    if (profile) {
      setRadius(profile.service_radius || 10);
      setShareLocation(profile.share_location || false);
      setPostcode(profile.postcode || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setSaving(true);
    console.group('Service Area Update Debug');
    try {
      console.log('Starting profile update with:', {
        id: profile.id,
        currentState: {
          share_location: profile.share_location,
          latitude: profile.latitude,
          longitude: profile.longitude,
          service_radius: profile.service_radius,
          postcode: profile.postcode,
        },
      });

      // Get coordinates from postcode
      const coords = await geocodePostcode(postcode);
      console.log('Geocoded coordinates:', coords);

      if (!coords.latitude || !coords.longitude) {
        throw new Error('Failed to get valid coordinates for postcode');
      }

      const updates = {
        service_radius: radius,
        share_location: shareLocation,
        postcode,
        latitude: coords.latitude,
        longitude: coords.longitude,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating profile with:', updates);

      // Update profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully:', updatedProfile);

      // Verify the update
      const { data: verifyProfile, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (verifyError) {
        console.error('Verification error:', verifyError);
      } else {
        console.log('Verified profile state:', {
          share_location: verifyProfile.share_location,
          latitude: verifyProfile.latitude,
          longitude: verifyProfile.longitude,
          service_radius: verifyProfile.service_radius,
          postcode: verifyProfile.postcode,
        });
      }

      toast.success('Service area settings updated successfully');
    } catch (error) {
      console.error('Error updating service area:', error);
      toast.error('Failed to update service area');
    } finally {
      console.groupEnd();
      setSaving(false);
    }
  };

  if (profileLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      {profile?.latitude && profile?.longitude ? (
        <div className="alert alert-success">
          <MapPin className="h-4 w-4" />
          <span>
            Current location: {profile.latitude.toFixed(6)},{' '}
            {profile.longitude.toFixed(6)}
          </span>
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
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g., M4 7AZ"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Service Radius: {radius} km</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
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
            <span className="label-text">
              Share Live Location During Working Hours
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={shareLocation}
              onChange={(e) => setShareLocation(e.target.checked)}
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
          className={`btn btn-primary w-full ${
            saving || geocoding ? 'loading' : ''
          }`}
          disabled={saving || geocoding}
        >
          {saving || geocoding ? 'Saving...' : 'Save Changes'}
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
              form: {
                postcode,
                radius,
                shareLocation,
              },
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="flex justify-center">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setDebugMode(!debugMode)}
        >
          {debugMode ? 'Hide Debug Tools' : 'Show Debug Tools'}
        </button>
      </div>

      {debugMode && <ServiceAreaDebug />}
    </div>
  );
}
