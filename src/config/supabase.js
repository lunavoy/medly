import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.com/dashboard/project/ygbozjqyuiwknqnrspfz'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYm96anF5dWl3a25xbnJzcGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4Nzc2NTgsImV4cCI6MjA3NTQ1MzY1OH0.-jD8GGJ8G8XaY0fhFKlo0KV5WpKjW0rW6_AUMu-qhpw'

export const supabase = createClient(supabaseUrl, supabaseKey)