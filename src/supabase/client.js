import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygbozjqyuiwknqnrspfz.supabase.co'
const supabaseKey = 'sb_publishable_by1rr_0wxvefZBW-C2GHug_y0ArM8Gy'

export const supabase = createClient(supabaseUrl, supabaseKey)