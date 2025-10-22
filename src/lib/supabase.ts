import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rpihyvkoblelvekuqeee.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaWh5dmtvYmxlbHZla3VxZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Nzg1ODEsImV4cCI6MjA3NjU1NDU4MX0.0VtHfDFEHsUbFcJasqpgjQCPtgWtBNo-3XfSAkUTwh4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
