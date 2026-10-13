import { Wrench } from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';

export default async function ContributorsAdminPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Contributors</h1>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
          <Wrench className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">This page is under development</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Please check back soon.
        </p>
      </div>
    </div>
  );
}
