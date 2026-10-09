import { createClient } from '@supabase/supabase-js';

/**
 * Public, anon-key Supabase client for reading published content.
 * No session/cookies -> results are identical for every visitor, so they are
 * safe to cache (see src/lib/queries.ts). Row Level Security restricts reads to
 * published + scheduled content automatically.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
