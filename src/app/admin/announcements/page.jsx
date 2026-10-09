import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import AnnouncementRowActions from './_RowActions';

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const isSuper = admin.role === 'superadmin';

  const { data: rows } = await createAdminClient()
    .from('announcements')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  const items = rows || [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">News highlighter</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Active items scroll in the red bar at the top of the public site.
          </p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No news items yet. Create one to populate the ticker.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">News text</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((a) => (
                <tr key={a.id} className="text-slate-800 dark:text-slate-200">
                  <td className="max-w-md truncate px-4 py-3">{a.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        a.is_active
                          ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }
                    >
                      {a.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{a.priority}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/announcements/${a.id}/edit`}
                        className="rounded-md px-2 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      >
                        Edit
                      </Link>
                      {isSuper ? <AnnouncementRowActions id={a.id} /> : null}
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
