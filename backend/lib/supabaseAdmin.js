import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl  = process.env.VITE_SUPABASE_URL
const supabaseKey  = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)
