import { redirect } from 'next/navigation';
import { requireSuperadmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import Review from './_Review';

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

const actionBadge = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  update: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

export default async function SubmissionsPage() {
  try {
    await requireSuperadmin();
  } catch {
    redirect('/admin');
  }

  const supabase = createAdminClient();
  const { data: submissions, error } = await supabase
    .from('content_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pending submissions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review changes submitted by data-entry admins. Approve, modify before approving, or deny.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          Could not load submissions: {error.message}
        </p>
      ) : null}

      {!error && (!submissions || submissions.length === 0) ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No pending submissions. You are all caught up.
        </div>
      ) : null}

      <div className="space-y-4">
        {(submissions ?? []).map((sub) => (
          <section
            key={sub.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ' +
                  (actionBadge[sub.action] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200')
                }
              >
                {sub.action}
              </span>
              <span className="font-mono text-sm font-medium text-slate-800 dark:text-slate-100">
                {sub.target_table}
                {sub.target_id ? ` #${sub.target_id}` : ''}
              </span>
              <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                Submitted {formatDate(sub.submitted_at)}
              </span>
            </div>

            <Review submission={sub} />
          </section>
        ))}
      </div>
    </div>
  );
}
