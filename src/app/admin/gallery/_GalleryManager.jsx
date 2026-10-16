'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { Search, RotateCcw, ImageIcon } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import Pagination from '@/app/admin/_components/Pagination';
import { buildQuery } from '@/app/admin/_lib/pagination';
import DeletePhotoButton from './_RowActions';

const BASE = '/admin/gallery';
const control =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

/** Format a `taken_on` date (YYYY-MM-DD) for display, tolerating nulls. */
function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Thumb({ src, name }) {
  const resolved = resolveImageSrc(src);
  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={name || 'Gallery photo'}
        className="aspect-[4/3] w-full rounded-t-xl object-cover"
      />
    );
  }
  return (
    <span
      className="flex aspect-[4/3] w-full items-center justify-center rounded-t-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
      aria-hidden="true"
    >
      <ImageIcon className="h-8 w-8" />
    </span>
  );
}

function StatusBadge({ published }) {
  if (published) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        Published
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      Hidden
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

/**
 * Presentational manager for the gallery photo grid. Filtering, search and
 * paging run on the server; this component mirrors the URL (`?status=&q=&page=`)
 * and navigates on change. Search is debounced.
 */
export default function GalleryManager({
  rows = [],
  isSuper = false,
  stats = { total: 0, published: 0, hidden: 0 },
  filters = {},
  page = 1,
  total = 0,
  query = {},
}) {
  const router = useRouter();
  const { status = '', q = '' } = filters;

  const [term, setTerm] = useState(q);
  const mounted = useRef(false);
  useEffect(() => setTerm(q), [q]);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const id = setTimeout(() => {
      if ((term || '').trim() !== (q || '').trim()) navigate({ q: term });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  function navigate(next) {
    const merged = { status, q, ...next };
    const clean = {};
    for (const [k, v] of Object.entries(merged)) {
      clean[k] = v && v !== 'all' ? String(v).trim() : undefined;
    }
    const qs = buildQuery(clean, { page: undefined });
    router.push(qs ? `${BASE}?${qs}` : BASE, { scroll: false });
  }

  const filtersActive = Boolean(status || (q && q.trim()));

  if (stats.total === 0 && !filtersActive) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No photos yet. Add your first one.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Published" value={stats.published} />
        <Stat label="Hidden" value={stats.hidden} />
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search name…"
              aria-label="Search photos"
              className={cx(control, 'w-full pl-9')}
            />
          </div>

          <select
            value={status || 'all'}
            onChange={(e) => navigate({ status: e.target.value })}
            aria-label="Filter by status"
            className={control}
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>

          {filtersActive ? (
            <button
              type="button"
              onClick={() => {
                setTerm('');
                router.push(BASE, { scroll: false });
              }}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          ) : null}
        </div>

        <p className="mt-2 px-1 text-xs text-slate-500 dark:text-slate-400">
          {total} {total === 1 ? 'photo' : 'photos'}
          {filtersActive ? ' (filtered)' : ''}
        </p>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No photos match these filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="relative">
                  <Thumb src={row.image} name={row.name} />
                  <span className="absolute right-2 top-2">
                    <StatusBadge published={row.is_published} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {row.name || <span className="text-slate-400">Untitled</span>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(row.taken_on)}</p>
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-700/60">
                    <Link
                      href={`/admin/gallery/${row.id}/edit`}
                      className="rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      Edit
                    </Link>
                    {isSuper ? <DeletePhotoButton id={row.id} name={row.name} /> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination basePath={BASE} query={query} page={page} total={total} />
        </>
      )}
    </div>
  );
}
