import Link from '@/app/admin/_components/Link';
import {
  CalendarDays,
  FileCheck2,
  Inbox,
  MessageSquare,
  Megaphone,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

// Reads the session cookie + hits the DB per request — never prerender.
export const dynamic = 'force-dynamic';

/** Returns an exact row count for a table, 0 if the query errors. */
async function countOf(supabase, table, apply) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (apply) query = apply(query);
  const { count } = await query;
  return count ?? 0;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';
  const supabase = createAdminClient();

  const [events, pending, contact, feedback, announcements] = await Promise.all([
    countOf(supabase, 'events'),
    countOf(supabase, 'content_submissions', (q) => q.eq('status', 'pending')),
    countOf(supabase, 'contact_submissions'),
    countOf(supabase, 'feedback'),
    countOf(supabase, 'announcements'),
  ]);

  const stats = [
    { label: 'Events', value: events, href: '/admin/events', icon: CalendarDays },
    ...(isSuper
      ? [
          {
            label: 'Pending Submissions',
            value: pending,
            href: '/admin/submissions',
            icon: FileCheck2,
          },
        ]
      : []),
    { label: 'Contact Messages', value: contact, href: '/admin/messages', icon: Inbox },
    { label: 'Feedback', value: feedback, href: '/admin/messages', icon: MessageSquare },
    { label: 'Announcements', value: announcements, href: '/admin/announcements', icon: Megaphone },
  ];

  let recent = [];
  if (isSuper) {
    const { data } = await supabase
      .from('content_submissions')
      .select('id, target_table, action, submitted_at')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(5);
    recent = data || [];
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Welcome back, {admin.fullName || admin.email}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-gray-300 transition group-hover:text-emerald-500 dark:text-slate-600"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent pending submissions (superadmin only) */}
      {isSuper && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
            <h2 className="text-base font-semibold">Recent pending submissions</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                No pending submissions.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {recent.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-medium">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs uppercase text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                          {row.action}
                        </span>
                        <span className="text-gray-700 dark:text-slate-200">{row.target_table}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-slate-500">
                        #{row.id}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-gray-400 dark:text-slate-500">
                      {formatDate(row.submitted_at)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-3">
            <Link
              href="/admin/submissions"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all submissions →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
