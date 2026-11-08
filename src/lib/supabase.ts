import { createClient } from '@supabase/supabase-js';

// Forzamos la lectura directa de las variables de entorno
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://oxndsshohnypcjjnjvwo.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N8RaZ9O38F7eyywuU4Sx9w_6uZ_SOFt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);