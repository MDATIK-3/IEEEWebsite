import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Server-side read layer for the visitor analytics dashboard.
 *
 * Calls the SECURITY DEFINER aggregation functions from migration 0006 through
 * the service-role client (the only role allowed to execute them). Everything
 * is bucketed in Asia/Dhaka wall time to match the club's local calendar, and
 * the series are padded to a full skeleton so a month/day with no traffic
 * renders as a zero rather than a hole in the chart.
 */

const TZ = 'Asia/Dhaka';

export interface AnalyticsSummary {
  total_views: number;
  total_visitors: number;
  views_today: number;
  visitors_today: number;
  views_7d: number;
  visitors_7d: number;
  views_30d: number;
  visitors_30d: number;
}

export interface SeriesPoint {
  key: string; // 'YYYY-MM' (monthly) or 'YYYY-MM-DD' (daily)
  label: string; // short display label
  views: number;
  visitors: number;
}

export interface NamedCount {
  label: string;
  views: number;
  visitors?: number;
}

export interface DashboardAnalytics {
  available: boolean; // false => tables/functions not found (migration not applied)
  hasData: boolean; // true once at least one view is recorded
  summary: AnalyticsSummary;
  monthly: SeriesPoint[]; // last 12 months
  daily: SeriesPoint[]; // last 30 days
  topPaths: NamedCount[];
  devices: NamedCount[];
  referrers: NamedCount[];
}

const ZERO_SUMMARY: AnalyticsSummary = {
  total_views: 0,
  total_visitors: 0,
  views_today: 0,
  visitors_today: 0,
  views_7d: 0,
  visitors_7d: 0,
  views_30d: 0,
  visitors_30d: 0,
};

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const monthLabelFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  month: 'short',
  year: '2-digit',
});
const dayLabelFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  month: 'short',
  day: 'numeric',
});

/** 'YYYY-MM-DD' for an instant, in Dhaka time. */
function dayKey(d: Date): string {
  return dayKeyFmt.format(d);
}

/** Build the last `n` day buckets (oldest -> newest) as a zeroed skeleton. */
function daySkeleton(n: number): SeriesPoint[] {
  const todayKey = dayKey(new Date()); // e.g. '2026-10-24'
  const [y, m, d] = todayKey.split('-').map(Number);
  const anchor = Date.UTC(y, m - 1, d); // UTC midnight of the Dhaka calendar date
  const out: SeriesPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(anchor - i * 86_400_000);
    const key = dt.toISOString().slice(0, 10); // UTC parts == the calendar date we built
    out.push({ key, label: dayLabelFmt.format(dt), views: 0, visitors: 0 });
  }
  return out;
}

/** Build the last `n` month buckets (oldest -> newest) as a zeroed skeleton. */
function monthSkeleton(n: number): SeriesPoint[] {
  const todayKey = dayKey(new Date());
  const [y, m] = todayKey.split('-').map(Number);
  const out: SeriesPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const idx = (y * 12 + (m - 1)) - i; // absolute month index
    const yy = Math.floor(idx / 12);
    const mm = idx % 12; // 0-based
    const key = `${yy}-${String(mm + 1).padStart(2, '0')}`;
    // Use UTC noon on the 15th so the Dhaka month label never slips a boundary.
    const labelDate = new Date(Date.UTC(yy, mm, 15, 12));
    out.push({ key, label: monthLabelFmt.format(labelDate), views: 0, visitors: 0 });
  }
  return out;
}

type SeriesRow = { period: string; views: number | string; visitors: number | string };

/** Fold DB rows into a skeleton, matching on the Dhaka day/month key. */
function fillSeries(
  skeleton: SeriesPoint[],
  rows: SeriesRow[] | null,
  grain: 'day' | 'month'
): SeriesPoint[] {
  if (!rows?.length) return skeleton;
  const byKey = new Map(skeleton.map((p) => [p.key, p]));
  for (const row of rows) {
    const d = new Date(row.period);
    if (Number.isNaN(d.getTime())) continue;
    const k = grain === 'month' ? dayKey(d).slice(0, 7) : dayKey(d);
    const point = byKey.get(k);
    if (point) {
      point.views = Number(row.views) || 0;
      point.visitors = Number(row.visitors) || 0;
    }
  }
  return skeleton;
}

function toNamed(
  rows: Array<Record<string, unknown>> | null,
  labelCol: string
): NamedCount[] {
  if (!rows?.length) return [];
  return rows.map((r) => ({
    label: String(r[labelCol] ?? '—'),
    views: Number(r.views) || 0,
    visitors: r.visitors != null ? Number(r.visitors) || 0 : undefined,
  }));
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const sb = createAdminClient();

  const [summaryR, monthlyR, dailyR, pathsR, devicesR, referrersR] = await Promise.all([
    sb.rpc('analytics_summary'),
    sb.rpc('analytics_series', { bucket: 'month', since_days: 400 }),
    sb.rpc('analytics_series', { bucket: 'day', since_days: 30 }),
    sb.rpc('analytics_top_paths', { since_days: 30, max_rows: 8 }),
    sb.rpc('analytics_devices', { since_days: 30 }),
    sb.rpc('analytics_referrers', { since_days: 30, max_rows: 6 }),
  ]);

  // If the summary call errors, the migration almost certainly isn't applied yet.
  if (summaryR.error) {
    console.error('analytics_summary failed:', summaryR.error.message);
    return {
      available: false,
      hasData: false,
      summary: ZERO_SUMMARY,
      monthly: monthSkeleton(12),
      daily: daySkeleton(30),
      topPaths: [],
      devices: [],
      referrers: [],
    };
  }

  const rawSummary = (summaryR.data?.[0] ?? {}) as Record<string, unknown>;
  const summary: AnalyticsSummary = {
    total_views: Number(rawSummary.total_views) || 0,
    total_visitors: Number(rawSummary.total_visitors) || 0,
    views_today: Number(rawSummary.views_today) || 0,
    visitors_today: Number(rawSummary.visitors_today) || 0,
    views_7d: Number(rawSummary.views_7d) || 0,
    visitors_7d: Number(rawSummary.visitors_7d) || 0,
    views_30d: Number(rawSummary.views_30d) || 0,
    visitors_30d: Number(rawSummary.visitors_30d) || 0,
  };

  return {
    available: true,
    hasData: summary.total_views > 0,
    summary,
    monthly: fillSeries(monthSkeleton(12), monthlyR.data as SeriesRow[] | null, 'month'),
    daily: fillSeries(daySkeleton(30), dailyR.data as SeriesRow[] | null, 'day'),
    topPaths: toNamed(pathsR.data as Array<Record<string, unknown>> | null, 'path'),
    devices: toNamed(devicesR.data as Array<Record<string, unknown>> | null, 'device'),
    referrers: toNamed(referrersR.data as Array<Record<string, unknown>> | null, 'referrer_host'),
  };
}
