import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, createSupabaseWithAuth } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Profile } from '../types/profile';

// Define a type for the user object based on what we're using
interface ClerkUser {
  id: string;
  publicMetadata: {
    company_name?: string | null;
    [key: string]: any;
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [supabaseClient, setSupabaseClient] = useState(supabase);

  const setupAuth = async () => {
    if (!isSignedIn || !user) {
      console.log('No authenticated user:', { isSignedIn, userId: (user as ClerkUser | null)?.id });
      throw new Error('No authenticated user');
    }
    
    try {
      console.log('Getting token from Clerk...');
      const token = await getToken({ 
        template: 'supabase',
        skipCache: true
      });
      
      if (!token) {
        console.error('No token received from Clerk');
        throw new Error('Failed to get Supabase token');
      }

      console.log('Token received:', { 
        length: token.length,
        preview: `${token.slice(0, 20)}...${token.slice(-20)}`
      });

      // Create a new Supabase client with the auth token
      const authClient = createSupabaseWithAuth(token);
      setSupabaseClient(authClient);

      return token;
    } catch (err) {
      console.error('Auth setup error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error'
      });
      throw err;
    }
  };

  const loadProfile = async () => {
    if (!isSignedIn || !user) {
      console.log('No authenticated user in loadProfile');
      setLoading(false);
      return;
    }

    try {
      await setupAuth();
      
      const clerkUser = user as ClerkUser;
      console.log('Fetching user for user_id:', clerkUser.id);
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('user_id', clerkUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('User fetch error:', fetchError);
        throw fetchError;
      }

      if (!existingUser) {
        console.log('Creating new user profile...');
        const newUserData = {
          user_id: clerkUser.id,
          fullname: user.fullName || '',
          company_name: clerkUser.publicMetadata?.company_name || null,
          created_at: new Date().toISOString(),
          phone: '',
          email: user.emailAddresses[0]?.emailAddress || '',
          is_authorized: 1,
          is_activated: 1,
          company_postcode: null,
          service_type: 'Locksmith'
          // These fields don't exist in the users table yet
          // service_radius: 10,
          // share_location: false
        };

        console.log('New user data:', newUserData);

        const { data: newUser, error: createError } = await supabaseClient
          .from('users')
          .insert([newUserData])
          .select()
          .single();
        
        if (createError) {
          console.error('User creation error:', createError);
          throw new Error('Failed to create user profile');
        }
        
        console.log('New user profile created:', newUser);
        // Convert user data to profile format for compatibility
        const profileData: Profile = {
          id: newUser.user_id,
          company_name: newUser.company_name,
          telephone_number: newUser.phone || null,
          website: null,
          address_line1: null,
          address_line2: null,
          city: null,
          county: null,
          postcode: newUser.company_postcode || null,
          country: 'United Kingdom',
          service_radius: 10, // Default value since it's not in the users table
          share_location: false, // Default value since it's not in the users table
          latitude: null,
          longitude: null,
          created_at: newUser.created_at,
          updated_at: newUser.created_at
        };
        setProfile(profileData);
      } else {
        console.log('Found existing user:', existingUser);
        // Convert user data to profile format for compatibility
        const profileData: Profile = {
          id: existingUser.user_id,
          company_name: existingUser.company_name,
          telephone_number: existingUser.phone || null,
          website: null,
          address_line1: null,
          address_line2: null,
          city: null,
          county: null,
          postcode: existingUser.company_postcode || null,
          country: 'United Kingdom',
          service_radius: 10, // Default value since it's not in the users table
          share_location: false, // Default value since it's not in the users table
          latitude: null,
          longitude: null,
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
      await setupAuth();
      const clerkUser = user as ClerkUser;

      // Convert profile updates to user table format
      const userUpdates: Record<string, any> = {};
      
      // Map profile fields to user table fields
      if (updates.company_name !== undefined) userUpdates.company_name = updates.company_name;
      if (updates.telephone_number !== undefined) userUpdates.phone = updates.telephone_number;
      if (updates.postcode !== undefined) userUpdates.company_postcode = updates.postcode;
      // These fields don't exist in the users table yet
      // if (updates.service_radius !== undefined) userUpdates.service_radius = updates.service_radius;
      // if (updates.share_location !== undefined) userUpdates.share_location = updates.share_location;
      
      console.log('Updating user profile:', userUpdates);
      const { data: updatedUser, error: updateError } = await supabaseClient
        .from('users')
        .update(userUpdates)
        .eq('user_id', clerkUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('User profile update error:', updateError);
        throw updateError;
      }

      console.log('User profile updated:', updatedUser);
      
      // Convert updated user data to profile format for compatibility
      const profileData: Profile = {
        id: updatedUser.user_id,
        company_name: updatedUser.company_name,
        telephone_number: updatedUser.phone || null,
        website: null,
        address_line1: null,
        address_line2: null,
        city: null,
        county: null,
        postcode: updatedUser.company_postcode || null,
        country: 'United Kingdom',
        service_radius: 10, // Default value since it's not in the users table
        share_location: false, // Default value since it's not in the users table
        latitude: null,
        longitude: null,
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
    console.log('useEffect triggered with:', { isSignedIn, userId: (user as ClerkUser | null)?.id });
    loadProfile();
  }, [user, isSignedIn]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    isInitialized: !loading,
    testAuth: async () => {
      try {
        const { data: debugData } = await supabaseClient.rpc('debug_auth_state');
        console.log('testAuth result:', debugData);
        return debugData;
      } catch (err) {
        console.error('Auth test failed:', err);
        return null;
      }
    }
  };
}