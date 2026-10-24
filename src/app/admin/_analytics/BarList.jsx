'use client';

import { full, compact } from './format';

/**
 * Ranked horizontal bars for a single magnitude dimension (top pages, top
 * referrers). CSS bars — crisp at any width, value shown at the row end so the
 * number is never color-alone. One brand hue; bars grow from a shared baseline
 * with a rounded data-end.
 *
 * Props:
 *   items    : [{ label, views, visitors? }]
 *   colorClass: Tailwind text color for the bar (bar uses bg-current)
 *   emptyText: shown when there are no rows
 */
export default function BarList({ items, colorClass = 'text-emerald-600 dark:text-emerald-400', emptyText = 'No data yet.' }) {
  if (!items?.length) {
    return <p className="py-6 text-center text-sm text-gray-400 dark:text-slate-500">{emptyText}</p>;
  }

  const max = Math.max(1, ...items.map((it) => Number(it.views) || 0));

  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        const views = Number(it.views) || 0;
        const width = Math.max(2, (views / max) * 100);
        return (
          <li key={`${it.label}-${i}`}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="truncate text-xs font-medium text-gray-700 dark:text-slate-200" title={it.label}>
                {it.label}
              </span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                {compact(views)}
                {it.visitors != null && (
                  <span className="ml-1 font-normal text-gray-400 dark:text-slate-500">
                    · {compact(it.visitors)} vis
                  </span>
                )}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full bg-current ${colorClass}`}
                style={{ width: `${width}%` }}
                title={`${full(views)} views`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
