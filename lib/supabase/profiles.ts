import { supabase } from './client';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(profileId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ user_id: userId, ...profile }])
    .select()
    .single();

  if (error) throw error;
  return data;
}