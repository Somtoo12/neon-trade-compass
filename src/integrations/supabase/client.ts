// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pcmvvrxdsypnkoihvgem.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbXZ2cnhkc3lwbmtvaWh2Z2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTM1ODQsImV4cCI6MjA2MTg2OTU4NH0.blNh-Yt2Cy9YTrCXBPxDW0t6A3KzSG_tSOdjOILOTZo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);