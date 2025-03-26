import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x'
    }
  }
});

export async function debugAuth() {
  try {
    const { data, error } = await supabase.rpc('debug_auth_state');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Auth debug failed:', err);
    return null;
  }
}

export async function testConnection() {
  try {
    const { error } = await supabase.from('profiles').select('count');
    return !error;
  } catch {
    return false;
  }
}