import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// Development Access Toggle:
// When VITE_ENABLE_SUPABASE_AUTH is not explicitly 'true', Supabase connectivity is bypassed
// so developers/employees can use the development/demo access flow.
export const isSupabaseEnabled = import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';
export const isSupabaseConfigured = Boolean(isSupabaseEnabled && supabaseUrl && supabaseAnonKey);

// Fallback dummy credentials to prevent runtime crashes if env vars are temporarily unset
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-anon-key';

// Only enable auth persistence and URL listeners when Supabase is actively configured
export const supabase: SupabaseClient = createClient(validUrl, validKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured
  }
});
