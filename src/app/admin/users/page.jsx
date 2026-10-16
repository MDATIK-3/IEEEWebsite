import { redirect } from 'next/navigation';
import { getCurrentAdmin, isOwnerEmail } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import UsersManager from './_UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsersPage({ searchParams }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.role !== 'superadmin') redirect('/admin');

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const db = createAdminClient();
  const { data: profiles, count } = await db
    .from('admin_profiles')
    .select('id, full_name, role, is_active, created_at', { count: 'exact' })
    .order('created_at', { ascending: true })
    .range(from, to);

  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/users?${qs}` : '/admin/users');
  }

  let emailById = new Map();
  try {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    emailById = new Map((list?.users || []).map((u) => [u.id, u.email]));
  } catch {
  }

  const users = (profiles || []).map((p) => ({ ...p, email: emailById.get(p.id) || '—' }));

  return (
    <UsersManager
      users={users}
      meId={admin.userId}
      meIsOwner={isOwnerEmail(admin.email)}
      page={page}
      total={total}
      query={sp}
    />
  );
}
