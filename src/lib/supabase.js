/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase browser client setup for the virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added environment-variable configuration, OTP/CMS auth persistence, and demo-mode detection.
*********************************************************/

// ========================================================
// Imports and environment variables
// ========================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ========================================================
// Supabase client export
// ========================================================
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;
