import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  company_name: string | null;
  telephone_number: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string;
  service_radius: number;
  share_location: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if profile exists
        const { data: profiles, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);

        if (fetchError) throw fetchError;

        if (!profiles || profiles.length === 0) {
          // Create new profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              company_name: user.publicMetadata.company_name || 'Unknown Company',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              country: 'United Kingdom',
              service_radius: 10,
              share_location: false
            }])
            .select();

          if (createError) throw createError;
          if (mounted && newProfile?.[0]) {
            setProfile(newProfile[0]);
            setError(null);
          }
        } else if (mounted) {
          // Use first profile if multiple exist (shouldn't happen due to unique constraint)
          setProfile(profiles[0]);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load profile'));
          toast.error('Failed to load profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      throw new Error('Not authenticated');
    }

    try {
      const { data: updatedProfiles, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error('Supabase update error');
      }

      if (!updatedProfiles || updatedProfiles.length === 0) {
        throw new Error('No profile found to update');
      }

      const updatedProfile = updatedProfiles[0];
      setProfile(updatedProfile);
      setError(null);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      toast.error('Failed to update profile');
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
}