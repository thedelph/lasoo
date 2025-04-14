/**
 * @file useSupabaseProfile.ts
 * @description Hook for managing user profiles using Supabase Auth
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Profile } from '../types/profile';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useSupabaseProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isSignedIn, isLoaded } = useSupabaseAuth();

  const loadProfile = async () => {
    if (!isSignedIn || !user) {
      console.log('No authenticated user in loadProfile');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user for user_id:', user.id);
      // Use the RPC approach for better compatibility
      const { data: existingUserArray, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .filter('user_id', 'eq', user.id);

      if (fetchError) {
        console.error('User fetch error:', fetchError);
        throw fetchError;
      }
      
      // Extract the first user if available
      const existingUser = existingUserArray && existingUserArray.length > 0 
        ? existingUserArray[0] 
        : null;

      if (!existingUser) {
        console.log('Creating new user profile...');
        const newUserData = {
          user_id: user.id,
          fullname: user.user_metadata?.full_name || '',
          company_name: user.user_metadata?.company_name || null,
          created_at: new Date().toISOString(),
          phone: '',
          email: user.email || '',
          is_authorized: 1,
          is_activated: 1,
          company_postcode: null,
          service_type: 'Locksmith'
        };

        console.log('New user data:', newUserData);

        const { error: createError } = await supabase
          .from('users')
          .insert([newUserData]);
        
        if (createError) {
          console.error('User creation error:', createError);
          throw new Error('Failed to create user profile');
        }
        
        // Fetch the newly created user
        const { data: newUsers } = await supabase
          .from('users')
          .select('*')
          .filter('user_id', 'eq', user.id);
          
        const newUser = newUsers && newUsers.length > 0 ? newUsers[0] : null;
        
        if (!newUser) {
          throw new Error('Failed to retrieve created user profile');
        }
        
        console.log('New user profile created:', newUser);
        // Convert user data to profile format for compatibility
        // Extract metadata from user record if available (use an empty object if null/undefined)
      const userMetadata = newUser.metadata || {};
      
      const profileData: Profile = {
        id: newUser.user_id,
        company_name: newUser.company_name,
        telephone_number: newUser.phone || null,
        website: userMetadata.website || null,
        address_line1: userMetadata.address_line1 || null,
        address_line2: userMetadata.address_line2 || null,
        city: userMetadata.city || null,
        county: userMetadata.county || null,
        postcode: newUser.company_postcode || null,
        country: userMetadata.country || 'United Kingdom',
        service_radius: typeof newUser.service_radius !== 'undefined' ? newUser.service_radius : 10,
        share_location: typeof newUser.share_location !== 'undefined' ? newUser.share_location : false,
        latitude: newUser.latitude || null,
        longitude: newUser.longitude || null,
        created_at: newUser.created_at,
        updated_at: newUser.created_at
      };
        setProfile(profileData);
      } else {
        console.log('Found existing user:', existingUser);
        // Convert user data to profile format for compatibility
        // Extract metadata from user record if available (use an empty object if null/undefined)
      const userMetadata = existingUser.metadata || {};
      
      const profileData: Profile = {
        id: existingUser.user_id,
        company_name: existingUser.company_name,
        telephone_number: existingUser.phone || null,
        website: userMetadata.website || null,
        address_line1: userMetadata.address_line1 || null,
        address_line2: userMetadata.address_line2 || null,
        city: userMetadata.city || null,
        county: userMetadata.county || null,
        postcode: existingUser.company_postcode || null,
        country: userMetadata.country || 'United Kingdom',
        service_radius: typeof existingUser.service_radius !== 'undefined' ? existingUser.service_radius : 10,
        share_location: typeof existingUser.share_location !== 'undefined' ? existingUser.share_location : false,
        latitude: existingUser.latitude || null,
        longitude: existingUser.longitude || null,
        created_at: existingUser.created_at,
        updated_at: existingUser.created_at
      };
        setProfile(profileData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Profile loading error:', err);
      setError(err instanceof Error ? err : new Error('Failed to load profile'));
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isSignedIn || !user) {
      throw new Error('Not authenticated');
    }

    try {
      // Convert profile updates to user table format
      const userUpdates: Record<string, any> = {};
      
      // Map profile fields to user table fields
      if (updates.company_name !== undefined) userUpdates.company_name = updates.company_name;
      if (updates.telephone_number !== undefined) userUpdates.phone = updates.telephone_number;
      if (updates.postcode !== undefined) userUpdates.company_postcode = updates.postcode;
      
      // Map service settings to dedicated columns
      if (updates.service_radius !== undefined) userUpdates.service_radius = updates.service_radius;
      if (updates.share_location !== undefined) userUpdates.share_location = updates.share_location;
      if (updates.latitude !== undefined) userUpdates.latitude = updates.latitude;
      if (updates.longitude !== undefined) userUpdates.longitude = updates.longitude;
      
      // Map additional address fields to the metadata field
      const metaData: Record<string, any> = {};
      let hasMetaDataUpdates = false;
      
      // Collect address fields in metadata
      if (updates.address_line1 !== undefined) { metaData.address_line1 = updates.address_line1; hasMetaDataUpdates = true; }
      if (updates.address_line2 !== undefined) { metaData.address_line2 = updates.address_line2; hasMetaDataUpdates = true; }
      if (updates.city !== undefined) { metaData.city = updates.city; hasMetaDataUpdates = true; }
      if (updates.county !== undefined) { metaData.county = updates.county; hasMetaDataUpdates = true; }
      if (updates.country !== undefined) { metaData.country = updates.country; hasMetaDataUpdates = true; }
      if (updates.website !== undefined) { metaData.website = updates.website; hasMetaDataUpdates = true; }
      
      // If we have metadata updates, add them to the user updates
      if (hasMetaDataUpdates) {
        userUpdates.metadata = metaData;
      }
      
      console.log('Updating user profile:', userUpdates);
      const { error: updateError } = await supabase
        .from('users')
        .update(userUpdates)
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('User profile update error:', updateError);
        throw updateError;
      }
      
      // Fetch the updated user
      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .filter('user_id', 'eq', user.id);
        
      const updatedUser = updatedUsers && updatedUsers.length > 0 ? updatedUsers[0] : null;

      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user profile');
      }

      console.log('User profile updated:', updatedUser);
      
      // Extract metadata from user record if available (use an empty object if null/undefined)
      const userMetadata = updatedUser.metadata || {};
      
      // Convert updated user data to profile format for compatibility
      const profileData: Profile = {
        id: updatedUser.user_id,
        company_name: updatedUser.company_name,
        telephone_number: updatedUser.phone || null,
        website: userMetadata.website || null,
        address_line1: userMetadata.address_line1 || null,
        address_line2: userMetadata.address_line2 || null,
        city: userMetadata.city || null,
        county: userMetadata.county || null,
        postcode: updatedUser.company_postcode || null,
        country: userMetadata.country || 'United Kingdom',
        service_radius: typeof updatedUser.service_radius !== 'undefined' ? updatedUser.service_radius : 10,
        share_location: typeof updatedUser.share_location !== 'undefined' ? updatedUser.share_location : false,
        latitude: updatedUser.latitude || null,
        longitude: updatedUser.longitude || null,
        created_at: updatedUser.created_at,
        updated_at: new Date().toISOString()
      };
      
      setProfile(profileData);
      setError(null);
      toast.success('Profile updated successfully');
      return profileData;
    } catch (err) {
      console.error('Profile update error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(new Error(message));
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    if (isLoaded) {
      console.log('useEffect triggered with:', { isSignedIn, userId: user?.id });
      loadProfile();
    }
  }, [user, isSignedIn, isLoaded]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    isInitialized: !loading
  };
}
