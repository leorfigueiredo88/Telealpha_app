import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://qnwpqmwuyhnsyzwjmdle.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_RtTygttIwekWTyKqhtA0oA_08HOMOBq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,   // sessão em memória; sem AsyncStorage nativo
    detectSessionInUrl: false,
  },
});
