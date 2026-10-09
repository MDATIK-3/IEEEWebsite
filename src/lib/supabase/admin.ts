import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. SERVER-ONLY — never import into client code.
 *
 * Bypasses Row Level Security, so it must only be used inside server actions /
 * route handlers AFTER verifying the caller is an authorized admin (e.g. a
 * superadmin applying an approved submission). The `server-only` import makes
 * the build fail if this file is ever pulled into a client bundle.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
