import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iullawluqvkirktkygrf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bGxhd2x1cXZraXJrdGt5Z3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzIyNDUsImV4cCI6MjA2MDc0ODI0NX0.cT_7-VVDdzRBHYb1p4onkfiI3r18CNQiP_grktz5A7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
