import { redirect } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import ExecutivesManager from './_ExecutivesManager';

export const dynamic = 'force-dynamic';

/** Normalize a search-param to a trimmed string, treating the "all" sentinel as absent. */
const norm = (v) => {
  const s = Array.isArray(v) ? v[0] : v;
  const t = (s ?? '').toString().trim();
  return t === 'all' ? '' : t;
};

export default async function ExecutivesAdminPage({ searchParams }) {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);
  const filters = {
    year: norm(sp.year),
    committee: norm(sp.committee),
    group: norm(sp.group),
    status: norm(sp.status),
    q: norm(sp.q),
  };

  const supabase = createAdminClient();

  // Filtered + paginated page of rows (server-side — only this slice is sent).
  let query = supabase
    .from('executives')
    .select('id, name, role, year, committee, member_group, img, is_published', { count: 'exact' });
  if (filters.year) query = query.eq('year', filters.year);
  if (filters.committee) query = query.eq('committee', filters.committee);
  if (filters.group) query = query.eq('member_group', filters.group);
  if (filters.status === 'published') query = query.eq('is_published', true);
  else if (filters.status === 'hidden') query = query.eq('is_published', false);
  if (filters.q) {
    // Strip PostgREST or()-filter metacharacters so the term is matched literally.
    const term = filters.q.replace(/[%,()]/g, ' ').trim();
    if (term) query = query.or(`name.ilike.%${term}%,role.ilike.%${term}%`);
  }
  query = query
    .order('year', { ascending: false })
    .order('committee', { ascending: true })
    .order('member_group', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .range(from, to);

  // Stats are whole-table (filter-independent); `year` column drives the dropdown.
  const [main, totalRes, publishedRes, yearRes] = await Promise.all([
    query,
    supabase.from('executives').select('id', { count: 'exact', head: true }),
    supabase.from('executives').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('executives').select('year').not('year', 'is', null),
  ]);

  const { data: rows, count, error } = main;
  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/executives?${qs}` : '/admin/executives');
  }

  const totalAll = totalRes.count ?? 0;
  const published = publishedRes.count ?? 0;
  const stats = { total: totalAll, published, hidden: Math.max(0, totalAll - published) };
  const years = [...new Set((yearRes.data || []).map((r) => r.year).filter((y) => y != null))].sort(
    (a, b) => b - a
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executives</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            All executive committee members across years, including hidden ones.
          </p>
        </div>
        <Link
          href="/admin/executives/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          New executive
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          Could not load executives: {error.message}
        </p>
      ) : (
        <ExecutivesManager
          rows={rows || []}
          isSuper={isSuper}
          stats={stats}
          years={years}
          filters={filters}
          page={page}
          total={total}
          query={sp}
        />
      )}
    </div>
  );
}
