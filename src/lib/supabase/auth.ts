import 'server-only';
import { cache } from 'react';
import { createClient } from './server';

export type AdminRole = 'superadmin' | 'data_entry';
export interface CurrentAdmin {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: AdminRole;
}

/**
 * Resolve the signed-in admin from the request cookies, or null.
 * Reads admin_profiles under the user's own RLS (self-select policy).
 *
 * Wrapped in React `cache()` so it runs at most once per server request: the
 * admin layout and the page it renders both need the current admin, and without
 * this each would re-run the identity check plus an `admin_profiles` query.
 *
 * Identity comes from `getClaims()`, which verifies the session JWT locally (via
 * the project's JWKS) when asymmetric signing keys are enabled — no network
 * round-trip to the Auth server on the hot path. The authoritative gate is still
 * robust: the request already passed the middleware auth check, forged tokens
 * fail signature verification, and we re-check `admin_profiles.is_active` below,
 * so deactivating an admin takes effect immediately regardless of token expiry.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, full_name, is_active')
    .eq('id', claims.sub)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;
  return {
    userId: claims.sub,
    email: claims.email ?? null,
    fullName: profile.full_name ?? null,
    role: profile.role as AdminRole,
  };
});

/** For server actions: throws if not an active admin. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

/** For server actions: throws unless the caller is a superadmin. */
export async function requireSuperadmin(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== 'superadmin') throw new Error('Forbidden: superadmin only');
  return admin;
}
