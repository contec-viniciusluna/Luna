import { createClient } from '@supabase/supabase-js';

     // Substitua pelos valores do seu projeto Supabase
     const supabaseUrl = 'https://iullawluqvkirktkygrf.supabase.co';
     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bGxhd2x1cXZraXJrdGt5Z3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE3MjI0NSwiZXhwIjoyMDYwNzQ4MjQ1fQ.Hwj_JL-IdlJWI6TBg9DLviBaz1oOe7c169OrWxQDicU'; // Chave anônima do Supabase

     export const supabase = createClient(supabaseUrl, supabaseKey);