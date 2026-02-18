import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Form submissions will not work.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table name for form submissions
export const FORM_SUBMISSIONS_TABLE = 'contact_submissions';
