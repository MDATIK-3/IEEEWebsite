import Link from '@/app/admin/_components/Link';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import GalleryManager from './_GalleryManager';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const supabase = createAdminClient();
  const { data: photos, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('taken_on', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

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
        <GalleryManager rows={photos || []} isSuper={isSuper} />
      )}
    </div>
  );
}
