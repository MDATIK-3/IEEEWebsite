import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import MessagesClient from './_MessagesClient';

export const dynamic = 'force-dynamic';

// Each tab is backed by its own table; the active tab is driven by `?tab=` so the
// server loads (and paginates) only that one. Counts for the other tabs are cheap
// head-only queries used for the tab badges.
const TABS = {
  contact: { table: 'contact_submissions', columns: 'id, name, email, subject, message, status, created_at' },
  partnership: { table: 'partnership_submissions', columns: 'id, data, status, created_at' },
  feedback: { table: 'feedback', columns: 'id, name, email, rating, message, page, status, created_at' },
};

export default async function MessagesPage({ searchParams }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const sp = (await searchParams) ?? {};
  const tabRaw = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab = TABS[tabRaw] ? tabRaw : 'contact';
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const db = createAdminClient();
  const active = TABS[tab];

  const [rowsRes, contactCount, partnershipCount, feedbackCount] = await Promise.all([
    db
      .from(active.table)
      .select(active.columns, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to),
    db.from('contact_submissions').select('id', { count: 'exact', head: true }),
    db.from('partnership_submissions').select('id', { count: 'exact', head: true }),
    db.from('feedback').select('id', { count: 'exact', head: true }),
  ]);

  const total = rowsRes.count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/messages?${qs}` : '/admin/messages');
  }

  const counts = {
    contact: contactCount.count ?? 0,
    partnership: partnershipCount.count ?? 0,
    feedback: feedbackCount.count ?? 0,
  };

  return (
    <MessagesClient
      isSuper={admin.role === 'superadmin'}
      tab={tab}
      counts={counts}
      rows={rowsRes.data || []}
      page={page}
      total={total}
      query={sp}
    />
  );
}
