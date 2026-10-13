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


export const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'atikh4335@gmail.com').trim().toLowerCase();

export function isOwnerEmail(email: string | null | undefined): boolean {
  return !!email && email.trim().toLowerCase() === OWNER_EMAIL;
}


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
