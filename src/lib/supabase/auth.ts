import 'server-only';
import { cache } from 'react';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createClient } from './server';
import { createAdminClient } from './admin';

export type AdminRole = 'superadmin' | 'data_entry';
export interface CurrentAdmin {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: AdminRole;
}

interface AdminProfileRow {
  role: AdminRole;
  full_name: string | null;
  is_active: boolean;
}


export const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'atikh4335@gmail.com').trim().toLowerCase();

export function isOwnerEmail(email: string | null | undefined): boolean {
  return !!email && email.trim().toLowerCase() === OWNER_EMAIL;
}

const adminProfileTag = (userId: string) => `admin-profile:${userId}`;

/**
 * Cross-request cached read of an admin's profile row, keyed by user id.
 *
 * This single `admin_profiles` lookup was the one remote round-trip EVERY admin
 * navigation paid (the page's `requireAdmin()` re-runs it on each click, and
 * React's `cache()` only dedupes within one render). Caching it here — short TTL
 * plus explicit invalidation whenever a profile changes — takes it off the hot
 * path, so navigating between admin pages no longer blocks on the database just
 * to re-authorize.
 *
 * Reads with the service-role client on the id we already verified from the JWT,
 * so bypassing RLS returns exactly that user's own row — no privilege gain. A
 * transient DB error throws (so a failure is never cached as "not an admin");
 * only real results are stored.
 */
function readAdminProfile(userId: string): Promise<AdminProfileRow | null> {
  return unstable_cache(
    async (): Promise<AdminProfileRow | null> => {
      const db = createAdminClient();
      const { data, error } = await db
        .from('admin_profiles')
        .select('role, full_name, is_active')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as AdminProfileRow | null) ?? null;
    },
    ['admin-profile', userId],
    { revalidate: 60, tags: [adminProfileTag(userId)] }
  )();
}

/**
 * Drop the cached profile for a user. Call from any server action that changes
 * a profile's role / active state / existence so access reflects it immediately
 * instead of waiting out the TTL.
 */
export function revalidateAdminProfile(userId: string): void {
  revalidateTag(adminProfileTag(userId));
}

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  let profile: AdminProfileRow | null;
  try {
    profile = await readAdminProfile(claims.sub);
  } catch {
    // Transient profile-read failure: treat as unauthenticated for this request
    // without caching the negative result.
    return null;
  }

  if (!profile || !profile.is_active) return null;
  return {
    userId: claims.sub,
    email: claims.email ?? null,
    fullName: profile.full_name ?? null,
    role: profile.role as AdminRole,
  };
});

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function requireSuperadmin(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== 'superadmin') throw new Error('Forbidden: superadmin only');
  return admin;
}
