import { redirect } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { Phone, Mail, Clock, Navigation } from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import Pagination from '@/app/admin/_components/Pagination';
import { parsePage, pageRange, pageCount, buildQuery } from '@/app/admin/_lib/pagination';
import DeleteContactInfoButton from './_RowActions';

export const dynamic = 'force-dynamic';

// Only these lucide icons are rendered by the public BranchInfoCards; keep this
// list in sync with the icon <select> in _ContactInfoForm.
const ICONS = { Phone, Mail, Clock, Navigation };

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

export default async function ContactInfoAdminPage({ searchParams }) {
  const admin = await requireAdmin();
  const isSuper = admin.role === 'superadmin';

  const sp = (await searchParams) ?? {};
  const page = parsePage(sp.page);
  const { from, to } = pageRange(page);

  const supabase = createAdminClient();
  const { data: cards, count, error } = await supabase
    .from('contact_info')
    .select('id, icon, title, primary_value, sort_order, is_published', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  const total = count ?? 0;
  const pages = pageCount(total);
  if (total > 0 && page > pages) {
    const qs = buildQuery(sp, { page: pages > 1 ? pages : undefined });
    redirect(qs ? `/admin/contact-info?${qs}` : '/admin/contact-info');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Info</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The contact cards shown on the public Contact page, including unpublished ones.
          </p>
        </div>
        <Link
          href="/admin/contact-info/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          New card
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          Could not load contact info: {error.message}
        </p>
      ) : null}

      {!error && total === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No contact cards yet. Create your first one.
        </div>
      ) : null}

      {cards && cards.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {cards.map((card) => {
                const Icon = ICONS[card.icon];
                return (
                  <tr key={card.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      <span className="flex items-center gap-2">
                        {Icon ? (
                          <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        ) : null}
                        {card.title || <span className="text-slate-400">Untitled</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <span className="line-clamp-1 max-w-xs break-words">
                        {card.primary_value || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {card.sort_order ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <PublishState published={card.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/contact-info/${card.id}/edit`}
                          className="rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        >
                          Edit
                        </Link>
                        {isSuper ? (
                          <DeleteContactInfoButton id={card.id} title={card.title} />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <Pagination basePath="/admin/contact-info" query={sp} page={page} total={total} />
    </div>
  );
}
