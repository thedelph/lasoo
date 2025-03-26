"use client";

import { supabase } from './client';
import type { Database } from './types';

type Location = Database['public']['Tables']['locations']['Row'];

export async function updateLocation(
  profileId: string,
  latitude: number,
  longitude: number
) {
  try {
    const { data, error } = await supabase
      .from('locations')
      .upsert({
        profile_id: profileId,
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

export async function getLocation(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}