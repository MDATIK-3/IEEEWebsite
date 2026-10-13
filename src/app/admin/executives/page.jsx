import Link from '@/app/admin/_components/Link';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import ExecutivesManager from './_ExecutivesManager';

export const dynamic = 'force-dynamic';

export default async function ExecutivesAdminPage() {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const supabase = createAdminClient();
  const { data: executives, error } = await supabase
    .from('executives')
    .select('*')
    .order('year', { ascending: false })
    .order('committee', { ascending: true })
    .order('member_group', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

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
        <ExecutivesManager rows={executives || []} isSuper={isSuper} />
      )}
    </div>
  );
}
