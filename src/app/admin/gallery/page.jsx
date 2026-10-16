import { redirect } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import GalleryManager from './_GalleryManager';

export const dynamic = 'force-dynamic';

/** Normalize a search-param to a trimmed string, treating the "all" sentinel as absent. */
const norm = (v) => {
  const s = Array.isArray(v) ? v[0] : v;
  const t = (s ?? '').toString().trim();
  return t === 'all' ? '' : t;
};

export default async function GalleryAdminPage({ searchParams }) {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);
  const filters = { status: norm(sp.status), q: norm(sp.q) };

  const supabase = createAdminClient();

  let query = supabase
    .from('gallery_photos')
    .select('id, name, image, taken_on, is_published', { count: 'exact' });
  if (filters.status === 'published') query = query.eq('is_published', true);
  else if (filters.status === 'hidden') query = query.eq('is_published', false);
  if (filters.q) {
    const term = filters.q.replace(/[%,()]/g, ' ').trim();
    if (term) query = query.ilike('name', `%${term}%`);
  }
  query = query
    .order('taken_on', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const [main, totalRes, publishedRes] = await Promise.all([
    query,
    supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
    supabase.from('gallery_photos').select('id', { count: 'exact', head: true }).eq('is_published', true),
  ]);

  const { data: photos, count, error } = main;
  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/gallery?${qs}` : '/admin/gallery');
  }

  const totalAll = totalRes.count ?? 0;
  const published = publishedRes.count ?? 0;
  const stats = { total: totalAll, published, hidden: Math.max(0, totalAll - published) };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            All gallery photos, including hidden ones.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          New photo
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          Could not load gallery: {error.message}
        </p>
      ) : (
        <GalleryManager
          rows={photos || []}
          isSuper={isSuper}
          stats={stats}
          filters={filters}
          page={page}
          total={total}
          query={sp}
        />
      )}
    </div>
  );
}
