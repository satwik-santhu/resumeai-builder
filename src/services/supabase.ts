import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing – running in localStorage-only mode');
}

/**
 * Supabase client — used throughout the app for DB and Auth operations.
 * Will be a no-op client if env vars are missing.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const isSupabaseConfigured =
  !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co';
