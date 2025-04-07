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

// Check admin status from the admin_users table

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
      
      if (!user) {
        setAdminUser(null);
        return;
      }
      
      // Check if the user is in the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (adminError || !adminData) {
        setAdminUser(null);
        return;
      }
      
      // Create an admin user object
      const adminUser: AdminUser = {
        id: adminData.id,
        email: adminData.email,
        is_super_admin: adminData.is_super_admin,
        created_at: adminData.created_at,
        updated_at: adminData.updated_at
      };
      
      setAdminUser(adminUser);
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
      
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if the user is in the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (adminError || !adminData) {
        throw new Error('Not authorized as admin');
      }
      
      // Create an admin user object
      const adminUser: AdminUser = {
        id: adminData.id,
        email: adminData.email,
        is_super_admin: adminData.is_super_admin,
        created_at: adminData.created_at,
        updated_at: adminData.updated_at
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
