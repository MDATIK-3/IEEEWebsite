import Link from '@/app/admin/_components/Link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import Pagination from '@/app/admin/_components/Pagination';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import ModeratorRowActions from './_RowActions';

export const dynamic = 'force-dynamic';

export default async function ModeratorsPage({ searchParams }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const { data: rows, count } = await createAdminClient()
    .from('moderator_messages')
    .select('id, name, title, image, message, sort_order, is_published', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .range(from, to);

  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/moderators?${qs}` : '/admin/moderators');
  }

  const items = rows || [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Moderator messages</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Leadership messages shown on the home page. Cards are ordered by the order value (low to high).
          </p>
        </div>
        <Link
          href="/admin/moderators/new"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No moderator messages yet. Create one to populate the home page.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Person</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((m) => (
                <tr key={m.id} className="align-top text-slate-800 dark:text-slate-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.image}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {(m.name || '?').charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium">{m.name}</div>
                        {m.title ? (
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">{m.title}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="line-clamp-2">{m.message}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.is_published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {m.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{m.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/moderators/${m.id}/edit`}
                        className="rounded-md px-2 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      >
                        Edit
                      </Link>
                      {isSuper ? <ModeratorRowActions id={m.id} name={m.name} /> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination basePath="/admin/moderators" query={sp} page={page} total={total} />
    </div>
  );
}
