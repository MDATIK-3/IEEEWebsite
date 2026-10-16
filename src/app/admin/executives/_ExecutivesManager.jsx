'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/app/admin/_components/Link';
import { Search, RotateCcw } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import Pagination from '@/app/admin/_components/Pagination';
import { buildQuery } from '@/app/admin/_lib/pagination';
import { COMMITTEES, GROUPS, committeeLabel, groupLabel } from './_meta';
import DeleteExecutiveButton from './_RowActions';

const BASE = '/admin/executives';
const control =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

function initials(name) {
  const letters = (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
  return letters || '?';
}

function Avatar({ src, name }) {
  const resolved = resolveImageSrc(src);
  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={name || 'Member'}
        className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-700"
      />
    );
  }
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
      aria-hidden="true"
    >
      {initials(name)}
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
 * Presentational manager for the executives list. Filtering, search and paging
 * all run on the server: this component reflects the current URL
 * (`?year=&committee=&group=&status=&q=&page=`) and navigates to a new URL when
 * a control changes, so each view loads only its own page of rows. Search is
 * debounced so typing does not fire a request per keystroke.
 */
export default function ExecutivesManager({
  rows = [],
  isSuper = false,
  stats = { total: 0, published: 0, hidden: 0 },
  years = [],
  filters = {},
  page = 1,
  total = 0,
  query = {},
}) {
  const router = useRouter();
  const { year = '', committee = '', group = '', status = '', q = '' } = filters;

  // Debounced search box: keep the keystrokes local, push to the URL after a pause.
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
    const merged = { year, committee, group, status, q, ...next };
    const clean = {};
    for (const [k, v] of Object.entries(merged)) {
      clean[k] = v && v !== 'all' ? String(v).trim() : undefined;
    }
    const qs = buildQuery(clean, { page: undefined });
    router.push(qs ? `${BASE}?${qs}` : BASE, { scroll: false });
  }

  const filtersActive = Boolean(year || committee || group || status || (q && q.trim()));

  // Whole table empty and no filters → show the create prompt instead of an
  // empty filter bar.
  if (stats.total === 0 && !filtersActive) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No executives yet. Create your first one.
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
              placeholder="Search name or role…"
              aria-label="Search executives"
              className={cx(control, 'w-full pl-9')}
            />
          </div>

          <select
            value={year || 'all'}
            onChange={(e) => navigate({ year: e.target.value })}
            aria-label="Filter by year"
            className={control}
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={committee || 'all'}
            onChange={(e) => navigate({ committee: e.target.value })}
            aria-label="Filter by committee"
            className={control}
          >
            <option value="all">All committees</option>
            {COMMITTEES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={group || 'all'}
            onChange={(e) => navigate({ group: e.target.value })}
            aria-label="Filter by group"
            className={control}
          >
            <option value="all">All groups</option>
            {GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

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
          {total} {total === 1 ? 'result' : 'results'}
          {filtersActive ? ' (filtered)' : ''}
        </p>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No executives match these filters.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Committee</th>
                  <th className="px-4 py-3 font-semibold">Group</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={row.img} name={row.name} />
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {row.name || <span className="text-slate-400">Unnamed</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.role || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.year ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {committeeLabel(row.committee)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {groupLabel(row.member_group)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge published={row.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/executives/${row.id}/edit`}
                          className="rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        >
                          Edit
                        </Link>
                        {isSuper ? <DeleteExecutiveButton id={row.id} name={row.name} /> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination basePath={BASE} query={query} page={page} total={total} />
        </>
      )}
    </div>
  );
}
