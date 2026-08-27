import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key missing from environment variables.');
}

/**
 * Public Supabase Client (Anon Key Only).
 * Never import or use the Service Role Key in the frontend.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
