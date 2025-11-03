import { createClient } from '@supabase/supabase-js'

// Get environment variables - these are available at build time for client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client - this is safe even during build as it's used in client components only
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
