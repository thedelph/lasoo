import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

// List of admin emails that can access the admin dashboard
const ADMIN_EMAILS = ['chrishide87@gmail.com', 'ant.mad@gmail.com'];

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      
      // First check if the user is authenticated with Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        setAdminUser(null);
        return;
      }
      
      // Check if the user's email is in the allowed admin emails list
      if (ADMIN_EMAILS.includes(user.email)) {
        // Create an admin user object
        const adminUser: AdminUser = {
          id: user.id,
          email: user.email,
          is_super_admin: true,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setAdminUser(adminUser);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Failed to verify admin credentials');
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if the email is in the allowed admin emails list
      if (!ADMIN_EMAILS.includes(email)) {
        throw new Error('Not authorized as admin');
      }
      
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create an admin user object
      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email!,
        is_super_admin: true,
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setAdminUser(adminUser);
      toast.success('Signed in as admin');
      return data;
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setAdminUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return {
    adminUser,
    loading,
    adminSignIn,
    adminSignOut,
    isAdmin: !!adminUser,
    isSuperAdmin: adminUser?.is_super_admin || false,
  };
}
