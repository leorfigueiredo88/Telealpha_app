import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qnwpqmwuyhnsyzwjmdle.supabase.co';
const supabaseKey = 'sb_publishable_RtTygttIwekWTyKqhtA0oA_08HOMOBq';

export const supabase = createClient(supabaseUrl, supabaseKey);