import { redirect } from 'next/navigation';
import { getCurrentAdmin, isOwnerEmail } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import UsersManager from './_UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.role !== 'superadmin') redirect('/admin');

  const db = createAdminClient();
  const { data: profiles } = await db
    .from('admin_profiles')
    .select('id, full_name, role, is_active, created_at')
    .order('created_at', { ascending: true });

  let emailById = new Map();
  try {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    emailById = new Map((list?.users || []).map((u) => [u.id, u.email]));
  } catch {
  }

  const users = (profiles || []).map((p) => ({ ...p, email: emailById.get(p.id) || '—' }));

  return <UsersManager users={users} meId={admin.userId} meIsOwner={isOwnerEmail(admin.email)} />;
}
