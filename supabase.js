import { createClient } from '@supabase/supabase-js'

// Coloque essas duas variáveis no .env.local do seu projeto Next.js:
// NEXT_PUBLIC_SUPABASE_URL=xxxxx
// NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
