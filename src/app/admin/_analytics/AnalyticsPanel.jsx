import { Users, Eye, UserCheck, CalendarClock, Globe, MonitorSmartphone, AlertTriangle, LineChart } from 'lucide-react';
import TimeSeriesChart from './TimeSeriesChart';
import BarList from './BarList';
import DeviceBreakdown from './DeviceBreakdown';
import { compact, full } from './format';

// Series colors (validated for CVD against the dashboard surfaces).
const VISITORS = 'text-[#1baf7a] dark:text-[#199e70]'; // brand aqua/emerald
const VIEWS = 'text-[#2a78d6] dark:text-[#3987e5]'; // blue

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-3xl font-bold tracking-tight" title={typeof value === 'number' ? full(value) : undefined}>
        {typeof value === 'number' ? compact(value) : value}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
      <h2 className="text-base font-semibold">{children}</h2>
    </div>
  );
}

export default function AnalyticsPanel({ analytics }) {
  const { available, hasData, summary, monthly, daily, topPaths, devices, referrers } = analytics;

  return (
    <section className="mt-2">
      <SectionHeading icon={LineChart}>Site traffic</SectionHeading>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Users}
          label="Total visitors"
          value={summary.total_visitors}
          sub={`${full(summary.total_views)} total views`}
        />
        <StatTile
          icon={UserCheck}
          label="Visitors · last 30 days"
          value={summary.visitors_30d}
          sub={`${full(summary.views_30d)} views`}
        />
        <StatTile
          icon={Eye}
          label="Visitors · last 7 days"
          value={summary.visitors_7d}
          sub={`${full(summary.views_7d)} views`}
        />
        <StatTile
          icon={CalendarClock}
          label="Visitors today"
          value={summary.visitors_today}
          sub={`${full(summary.views_today)} views`}
        />
      </div>

      {/* Setup notice — the analytics tables aren't in the DB yet */}
      {!available && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-500/40 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200">Analytics tables not found</p>
            <p className="mt-1 text-amber-700 dark:text-amber-300/90">
              Apply the migration to start collecting visitor data:
            </p>
            <code className="mt-2 block rounded bg-amber-100 px-2 py-1 font-mono text-xs text-amber-900 dark:bg-amber-500/15 dark:text-amber-100">
              node scripts/push-schema.mjs supabase/migrations/0006_analytics.sql
            </code>
          </div>
        </div>
      )}

      {/* "Collecting" notice — tables exist but no views recorded yet */}
      {available && !hasData && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
          Visitor tracking is live. The charts below will fill in as people browse the public site —
          the last-12-months view builds up month by month.
        </div>
      )}

      {available && (
        <>
          {/* Headline: visitors & views over the last 12 months */}
          <Card className="mt-4">
            <TimeSeriesChart
              title="Visitors & views — last 12 months"
              subtitle="Monthly totals, Asia/Dhaka time"
              points={monthly}
              series={[
                { key: 'visitors', name: 'Visitors', colorClass: VISITORS },
                { key: 'views', name: 'Views', colorClass: VIEWS },
              ]}
            />
          </Card>

          {/* 30-day trend + device split */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <TimeSeriesChart
                title="Visitors — last 30 days"
                subtitle="Daily unique visitors"
                points={daily}
                series={[{ key: 'visitors', name: 'Visitors', colorClass: VISITORS }]}
              />
            </Card>
            <Card className="lg:col-span-2">
              <SectionHeading icon={MonitorSmartphone}>Devices · 30 days</SectionHeading>
              <DeviceBreakdown items={devices} />
            </Card>
          </div>

          {/* Top pages + referrers */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <SectionHeading icon={Eye}>Top pages · 30 days</SectionHeading>
              <BarList items={topPaths} colorClass={VISITORS} emptyText="No page views in the last 30 days." />
            </Card>
            <Card>
              <SectionHeading icon={Globe}>Top referrers · 30 days</SectionHeading>
              <BarList
                items={referrers}
                colorClass={VIEWS}
                emptyText="No external referrers yet — most visits are direct."
              />
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
