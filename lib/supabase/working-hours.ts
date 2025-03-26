"use client";

import { supabase } from './client';
import type { Database } from './types';

type WorkingHours = Database['public']['Tables']['working_hours']['Row'];

export async function getWorkingHours(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('working_hours')
      .select('*')
      .eq('profile_id', profileId)
      .order('day');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching working hours:', error);
    throw error;
  }
}

export async function updateWorkingHours(
  profileId: string,
  day: string,
  updates: Partial<WorkingHours>
) {
  try {
    const { data, error } = await supabase
      .from('working_hours')
      .upsert({
        profile_id: profileId,
        day,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating working hours:', error);
    throw error;
  }
}

export async function initializeWorkingHours(profileId: string) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const defaultHours = days.map(day => ({
    profile_id: profileId,
    day,
    start_time: day === 'sunday' ? null : '09:00',
    end_time: day === 'sunday' ? null : '17:00',
    is_closed: day === 'sunday'
  }));

  try {
    const { data, error } = await supabase
      .from('working_hours')
      .upsert(defaultHours)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing working hours:', error);
    throw error;
  }
}