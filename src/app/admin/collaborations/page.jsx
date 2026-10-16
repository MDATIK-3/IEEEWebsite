import { redirect } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { Handshake } from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import Pagination from '@/app/admin/_components/Pagination';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import DeleteCollaborationButton from './_RowActions';

export const dynamic = 'force-dynamic';

function PublishState({ published }) {
  if (!published) {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        Draft
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      Published
    </span>
  );
}

function Logo({ src, name }) {
  const resolved = resolveImageSrc(src);
  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={name || 'Collaboration logo'}
        className="h-10 w-10 shrink-0 rounded-md object-contain ring-1 ring-slate-200 dark:ring-slate-700"
      />
    );
  }
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
      aria-hidden="true"
    >
      <Handshake className="h-5 w-5" />
    </span>
  );
}

export default async function CollaborationsAdminPage({ searchParams }) {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const supabase = createAdminClient();
  const { data: collaborations, count, error } = await supabase
    .from('collaborations')
    .select('id, name, organization, image, sort_order, is_published', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })
    .range(from, to);

  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/collaborations?${qs}` : '/admin/collaborations');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Collaborations</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Partner and collaborator logos shown on the public site, including unpublished ones.
          </p>
        </div>
        <Link
          href="/admin/collaborations/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          New collaboration
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          Could not load collaborations: {error.message}
        </p>
      ) : null}

      {!error && total === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No collaborations yet. Create your first one.
        </div>
      ) : null}

      {collaborations && collaborations.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Organization</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {collaborations.map((collab) => (
                <tr key={collab.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    <span className="flex items-center gap-3">
                      <Logo src={collab.image} name={collab.name} />
                      {collab.name || <span className="text-slate-400">Untitled</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="line-clamp-2 max-w-sm break-words">
                      {collab.organization || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {collab.sort_order ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <PublishState published={collab.is_published} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/collaborations/${collab.id}/edit`}
                        className="rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      >
                        Edit
                      </Link>
                      {isSuper ? (
                        <DeleteCollaborationButton id={collab.id} name={collab.name} />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <Pagination basePath="/admin/collaborations" query={sp} page={page} total={total} />
    </div>
  );
}
