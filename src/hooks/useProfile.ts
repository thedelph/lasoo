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
      console.log('Fetching profile for user:', clerkUser.id);
      const { data: existingProfile, error: fetchError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', clerkUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Profile fetch error:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        console.log('Creating new profile...');
        const newProfileData = {
          id: clerkUser.id,
          company_name: clerkUser.publicMetadata?.company_name || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          country: 'United Kingdom',
          service_radius: 10,
          share_location: false
        };

        console.log('New profile data:', newProfileData);

        const { data: newProfile, error: createError } = await supabaseClient
          .from('profiles')
          .insert([newProfileData])
          .select()
          .single();
        
        if (createError) {
          console.error('Profile creation error:', createError);
          throw new Error('Failed to create profile');
        }
        
        console.log('New profile created:', newProfile);
        setProfile(newProfile);
      } else {
        console.log('Found existing profile:', existingProfile);
        setProfile(existingProfile);
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

      console.log('Updating profile:', updates);
      const { data: updatedProfile, error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', clerkUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated:', updatedProfile);
      setProfile(updatedProfile);
      setError(null);
      toast.success('Profile updated successfully');
      return updatedProfile;
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