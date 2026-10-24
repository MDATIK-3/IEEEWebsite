'use client';

import { useState } from 'react';
import { compact, full, niceMax } from './format';

/**
 * Responsive area + line chart for one or two count series on a single axis
 * (views and visitors share the same unit, so one scale is correct — never a
 * dual axis). Series colors are theme-aware via Tailwind `text-*`/`dark:text-*`
 * classes + `currentColor`, so dark mode is a selected step, not an auto-flip.
 *
 * Props:
 *   points  : [{ key, label, <seriesKey>: number, ... }]
 *   series  : [{ key, name, colorClass }]  (colorClass sets the series hue)
 *   unitNote: optional short caption shown under the title
 */

const W = 760;
const H = 280;
const PAD = { t: 14, r: 18, b: 26, l: 42 };
const INNER_W = W - PAD.l - PAD.r;
const INNER_H = H - PAD.t - PAD.b;
const BASE_Y = PAD.t + INNER_H;

export default function TimeSeriesChart({ points, series, title, subtitle }) {
  const [hover, setHover] = useState(null);
  const n = points.length;

  const maxVal = Math.max(
    1,
    ...points.flatMap((p) => series.map((s) => Number(p[s.key]) || 0))
  );
  const top = niceMax(maxVal);

  const stepX = n > 1 ? INNER_W / (n - 1) : 0;
  const x = (i) => (n > 1 ? PAD.l + i * stepX : PAD.l + INNER_W / 2);
  const y = (v) => PAD.t + INNER_H * (1 - (Number(v) || 0) / top);

  const linePath = (key) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const areaPath = (key) =>
    `${linePath(key)} L ${x(n - 1).toFixed(1)} ${BASE_Y} L ${x(0).toFixed(1)} ${BASE_Y} Z`;

  // Gridlines + y ticks at 0, 25, 50, 75, 100%.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: top * f, yy: y(top * f) }));

  // Thin the x labels so they never collide (~7 across).
  const labelEvery = Math.max(1, Math.ceil(n / 7));
  const showLabel = (i) => i % labelEvery === 0 || i === n - 1;

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = n > 1 ? Math.round((svgX - PAD.l) / stepX) : 0;
    setHover(Math.max(0, Math.min(n - 1, idx)));
  }

  const hp = hover != null ? points[hover] : null;
  const hoverLeft = hp ? Math.min(92, Math.max(8, (x(hover) / W) * 100)) : 0;

  return (
    <figure className="m-0">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {series.length > 1 && (
          <ul className="flex items-center gap-4">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-full bg-current ${s.colorClass}`} />
                <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{s.name}</span>
              </li>
            ))}
          </ul>
        )}
      </figcaption>

      <div className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-none select-none"
          role="img"
          aria-label={`${title}. ${series.map((s) => s.name).join(' and ')} over ${n} periods.`}
        >
          {/* Gridlines + y ticks */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={t.yy}
                y2={t.yy}
                className="stroke-gray-200 dark:stroke-slate-700/70"
                strokeWidth={1}
              />
              <text
                x={PAD.l - 8}
                y={t.yy}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-gray-400 text-[10px] tabular-nums dark:fill-slate-500"
              >
                {compact(t.v)}
              </text>
            </g>
          ))}

          {/* Series: area wash + line, each wearing its own currentColor */}
          {series.map((s) => (
            <g key={s.key} className={s.colorClass}>
              <path d={areaPath(s.key)} className="fill-current" fillOpacity={0.1} stroke="none" />
              <path
                d={linePath(s.key)}
                fill="none"
                className="stroke-current"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* End marker with a surface ring so it stays legible */}
              <circle
                cx={x(n - 1)}
                cy={y(points[n - 1][s.key])}
                r={4}
                className="fill-current stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
            </g>
          ))}

          {/* X labels */}
          {points.map((p, i) =>
            showLabel(i) ? (
              <text
                key={p.key}
                x={x(i)}
                y={H - 8}
                textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                className="fill-gray-400 text-[10px] dark:fill-slate-500"
              >
                {p.label}
              </text>
            ) : null
          )}

          {/* Hover crosshair + highlighted points */}
          {hp && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.t}
                y2={BASE_Y}
                className="stroke-gray-300 dark:stroke-slate-600"
                strokeWidth={1}
              />
              {series.map((s) => (
                <circle
                  key={s.key}
                  cx={x(hover)}
                  cy={y(hp[s.key])}
                  r={4}
                  className={`fill-current stroke-white dark:stroke-slate-900 ${s.colorClass}`}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
        </svg>

        {/* Tooltip */}
        {hp && (
          <div
            className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
            style={{ left: `${hoverLeft}%` }}
          >
            <p className="mb-1 font-semibold text-gray-900 dark:text-slate-100">{hp.label}</p>
            <ul className="space-y-0.5">
              {series.map((s) => (
                <li key={s.key} className="flex items-center gap-2 whitespace-nowrap">
                  <span className={`inline-block h-2 w-2 rounded-full bg-current ${s.colorClass}`} />
                  <span className="text-gray-500 dark:text-slate-400">{s.name}</span>
                  <span className="ml-auto font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                    {full(hp[s.key])}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Screen-reader / print table — the always-available non-visual view */}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Period</th>
            {series.map((s) => (
              <th key={s.key}>{s.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.key}>
              <th scope="row">{p.label}</th>
              {series.map((s) => (
                <td key={s.key}>{full(p[s.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
