import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ytnrheoxmoisdgupczkp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bnJoZW94bW9pc2RndXBjemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDcxMDQsImV4cCI6MjA5NzcyMzEwNH0.KXTjvgzYPIFsFDGkfGbWezB0LIuJXnJxFmLo_Oar0us";

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export default supabase;