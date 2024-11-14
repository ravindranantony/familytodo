import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evnmirocnuligzhozzfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bm1pcm9jbnVsaWd6aG96emZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTkzNTUsImV4cCI6MjA0Njk3NTM1NX0.D10KtiD1q_8NN44wIGwPDmS4AjVxNzQCzOtmowwZqWw';

export const supabase = createClient(supabaseUrl, supabaseKey);