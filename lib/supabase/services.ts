"use client";

import { supabase } from './client';
import type { Database } from './types';

type Service = Database['public']['Tables']['services']['Row'];

export async function getServices(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('profile_id', profileId)
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

export async function updateService(serviceId: string, updates: Partial<Service>) {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function deleteService(serviceId: string) {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}