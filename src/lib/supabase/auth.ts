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
 * this each would issue its own `auth.getUser()` (a network round-trip to the
 * Supabase Auth server) plus an `admin_profiles` query. De-duping halves those
 * auth calls on every admin navigation.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, full_name, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;
  return {
    userId: user.id,
    email: user.email ?? null,
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
