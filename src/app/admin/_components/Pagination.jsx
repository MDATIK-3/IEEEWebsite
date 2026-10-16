import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from '@/app/admin/_components/Link';
import { PAGE_SIZE, pageCount, buildQuery } from '@/app/admin/_lib/pagination';

/**
 * Server-side list pager. Renders plain links (no client JS) that preserve the
 * current query (filters / search / tab) and only change `page`, so clicking a
 * page triggers a fresh server render that loads just that slice.
 *
 * @param {{
 *   basePath: string,            // e.g. '/admin/events'
 *   query?: Record<string, any>, // the page's resolved searchParams
 *   page?: number,               // current 1-based page
 *   pageSize?: number,
 *   total?: number,              // exact row count from the DB
 * }} props
 */
export default function Pagination({ basePath, query = {}, page = 1, pageSize = PAGE_SIZE, total = 0 }) {
  const pages = pageCount(total, pageSize);
  if (pages <= 1) return null;

  const current = Math.min(Math.max(1, page), pages);
  const href = (p) => {
    const qs = buildQuery(query, { page: p <= 1 ? undefined : p });
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  // Compact window: first, neighbours of current, last — with gaps elsewhere.
  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || (p >= current - 1 && p <= current + 1)) nums.push(p);
    else if (nums[nums.length - 1] !== 'gap') nums.push('gap');
  }

  const base =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition';
  const idle =
    'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800';
  const active = 'border-emerald-600 bg-emerald-600 text-white';
  const disabled = 'cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-600';

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{start}</span>–
        <span className="font-medium text-slate-700 dark:text-slate-300">{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        {current > 1 ? (
          <Link href={href(current - 1)} prefetch={false} rel="prev" aria-label="Previous page" className={`${base} ${idle}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${base} ${disabled}`}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {nums.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400 dark:text-slate-600">
              …
            </span>
          ) : p === current ? (
            <span key={p} aria-current="page" className={`${base} ${active}`}>
              {p}
            </span>
          ) : (
            <Link key={p} href={href(p)} prefetch={false} className={`${base} ${idle}`}>
              {p}
            </Link>
          )
        )}

        {current < pages ? (
          <Link href={href(current + 1)} prefetch={false} rel="next" aria-label="Next page" className={`${base} ${idle}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${base} ${disabled}`}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
