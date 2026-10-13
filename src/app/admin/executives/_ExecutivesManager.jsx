'use client';

import { useMemo, useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { Search, RotateCcw } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import { COMMITTEES, GROUPS, committeeLabel, groupLabel } from './_meta';
import DeleteExecutiveButton from './_RowActions';

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
 * Client-side manager for the executives list. The dataset is small (one row per
 * committee member), so it is fetched once on the server and filtered/searched
 * here for instant feedback — no per-keystroke round-trips. Delete runs through
 * the superadmin-only server action and refreshes from the server.
 *
 * @param {{ rows: object[], isSuper: boolean }} props
 */
export default function ExecutivesManager({ rows = [], isSuper = false }) {
  const [year, setYear] = useState('all');
  const [committee, setCommittee] = useState('all');
  const [group, setGroup] = useState('all');
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');

  const years = useMemo(
    () => [...new Set(rows.map((r) => r.year).filter((y) => y != null))].sort((a, b) => b - a),
    [rows]
  );

  const stats = useMemo(() => {
    const published = rows.filter((r) => r.is_published).length;
    return { total: rows.length, published, hidden: rows.length - published };
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (year !== 'all' && String(r.year) !== year) return false;
      if (committee !== 'all' && r.committee !== committee) return false;
      if (group !== 'all' && r.member_group !== group) return false;
      if (status === 'published' && !r.is_published) return false;
      if (status === 'hidden' && r.is_published) return false;
      if (needle) {
        const hay = `${r.name || ''} ${r.role || ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, year, committee, group, status, q]);

  const filtersActive =
    year !== 'all' || committee !== 'all' || group !== 'all' || status !== 'all' || q.trim() !== '';

  function clearFilters() {
    setYear('all');
    setCommittee('all');
    setGroup('all');
    setStatus('all');
    setQ('');
  }

  // Nothing in the table at all — show the create prompt rather than filters.
  if (rows.length === 0) {
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or role…"
              aria-label="Search executives"
              className={cx(control, 'w-full pl-9')}
            />
          </div>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
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
            value={group}
            onChange={(e) => setGroup(e.target.value)}
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          ) : null}
        </div>

        <p className="mt-2 px-1 text-xs text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No executives match these filters.
        </div>
      ) : (
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
              {filtered.map((row) => (
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
      )}
    </div>
  );
}
