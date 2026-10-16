import Link from '@/app/admin/_components/Link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import Pagination from '@/app/admin/_components/Pagination';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import AnnouncementRowActions from './_RowActions';

export const dynamic = 'force-dynamic';

const TZ = 'Asia/Dhaka';
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : fmt.format(d);
}

/**
 * Derive what the public actually sees right now from is_active + the schedule
 * window, so the admin list reflects reality instead of just the is_active flag.
 */
function scheduleStatus(a, now) {
  if (!a.is_active) return { label: 'Hidden', tone: 'slate' };
  const start = a.starts_at ? new Date(a.starts_at).getTime() : null;
  const end = a.ends_at ? new Date(a.ends_at).getTime() : null;
  if (end !== null && end < now) return { label: 'Expired', tone: 'amber' };
  if (start !== null && start > now) return { label: 'Scheduled', tone: 'sky' };
  return { label: 'Live', tone: 'emerald' };
}

const TONES = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export default async function AnnouncementsPage({ searchParams }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const { data: rows, count } = await createAdminClient()
    .from('announcements')
    .select('id, title, is_active, starts_at, ends_at, priority', { count: 'exact' })
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/announcements?${qs}` : '/admin/announcements');
  }

  const items = rows || [];
  const now = Date.now();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">News highlighter</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Items publish and expire automatically on their schedule. Times are {TZ.replace('_', ' ')}.
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
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((a) => {
                const status = scheduleStatus(a, now);
                const from = formatDate(a.starts_at);
                const until = formatDate(a.ends_at);
                return (
                  <tr key={a.id} className="align-top text-slate-800 dark:text-slate-200">
                    <td className="max-w-xs px-4 py-3">
                      <span className="line-clamp-2">{a.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONES[status.tone]}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      <div>{from ? <>From {from}</> : 'Immediately'}</div>
                      <div>{until ? <>Until {until}</> : 'No end date'}</div>
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
                        {isSuper ? <AnnouncementRowActions id={a.id} title={a.title} /> : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination basePath="/admin/announcements" query={sp} page={page} total={total} />
    </div>
  );
}
