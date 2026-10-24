'use client';

import { full, pct } from './format';

/**
 * Device-type split as a single stacked proportion bar + a legend. Three fixed
 * categorical hues (blue / aqua / orange, validated for CVD) assigned by device,
 * never by rank; a 2px surface gap separates the segments. The legend carries
 * the count and share so identity + value never rely on color alone.
 */

const DEVICE_META = {
  desktop: { name: 'Desktop', colorClass: 'text-[#2a78d6] dark:text-[#3987e5]' },
  mobile: { name: 'Mobile', colorClass: 'text-[#1baf7a] dark:text-[#199e70]' },
  tablet: { name: 'Tablet', colorClass: 'text-[#eb6834] dark:text-[#d95926]' },
  unknown: { name: 'Unknown', colorClass: 'text-gray-400 dark:text-slate-500' },
};
const ORDER = ['desktop', 'mobile', 'tablet', 'unknown'];

export default function DeviceBreakdown({ items, emptyText = 'No data yet.' }) {
  if (!items?.length) {
    return <p className="py-6 text-center text-sm text-gray-400 dark:text-slate-500">{emptyText}</p>;
  }

  const rows = items
    .map((it) => ({
      key: DEVICE_META[it.label] ? it.label : 'unknown',
      views: Number(it.views) || 0,
    }))
    .sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));

  const total = rows.reduce((sum, r) => sum + r.views, 0);

  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
        {rows.map((r) => {
          const width = pct(r.views, total);
          if (width <= 0) return null;
          return (
            <div
              key={r.key}
              className={`h-full bg-current ${DEVICE_META[r.key].colorClass}`}
              style={{ width: `${width}%` }}
              title={`${DEVICE_META[r.key].name}: ${full(r.views)}`}
            />
          );
        })}
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2 text-sm">
            <span className={`inline-block h-2.5 w-2.5 rounded-full bg-current ${DEVICE_META[r.key].colorClass}`} />
            <span className="text-gray-600 dark:text-slate-300">{DEVICE_META[r.key].name}</span>
            <span className="ml-auto font-semibold tabular-nums text-gray-900 dark:text-slate-100">
              {full(r.views)}
            </span>
            <span className="w-10 text-right tabular-nums text-gray-400 dark:text-slate-500">
              {pct(r.views, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
