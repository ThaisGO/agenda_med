import { createClient } from '@supabase/supabase-js'

const VITE_SUPABASE_URL = 'https://ttnmiudgfbrtdysppgxl.supabase.co'
const VITE_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QTAvzLHPTAKsIRE8rvZxnQ_gHIlSaG0'

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)