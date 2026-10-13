import Link from '@/app/admin/_components/Link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import SpotlightRowActions from './_RowActions';

export const dynamic = 'force-dynamic';

export default async function SpotlightsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const isSuper = admin.role === 'superadmin';

  const { data: rows } = await createAdminClient()
    .from('spotlights')
    .select('*')
    .order('id', { ascending: true });

  const items = rows || [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Member spotlights</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Community stories shown on the home page. Cards appear in the order they were created.
          </p>
        </div>
        <Link
          href="/admin/spotlights/new"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No spotlights yet. Create one to populate the home page.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Person</th>
                <th className="px-4 py-3 font-medium">Quote</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((s) => (
                <tr key={s.id} className="align-top text-slate-800 dark:text-slate-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.photo}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {(s.name || '?').charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium">{s.name}</div>
                        {s.role ? (
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">{s.role}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="line-clamp-2">{s.quote}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.is_published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {s.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/spotlights/${s.id}/edit`}
                        className="rounded-md px-2 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      >
                        Edit
                      </Link>
                      {isSuper ? <SpotlightRowActions id={s.id} name={s.name} /> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
