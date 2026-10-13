/**
 * Shared loading boundary for every /admin/* route.
 *
 * Admin pages are all `force-dynamic` (auth cookie + live DB reads), so a
 * navigation can't resolve until the server finishes rendering. Without a
 * loading boundary the browser just freezes on the previous page until then,
 * which is what made route changes feel slow.
 *
 * This skeleton lets the router swap in instant feedback on click while the
 * destination renders. It also gives Next's default (auto) prefetch a cheap,
 * cacheable boundary to stop at — so warming links no longer re-downloads the
 * whole dynamic payload (the old `?_rsc=` flood).
 *
 * The sidebar/top-bar live in the layout and stay mounted; only this main-area
 * content is replaced during a pending navigation.
 */
export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* Header: title + action button */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-72 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-28 rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Body: a card with a few placeholder rows */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="h-4 flex-1 rounded bg-slate-100 dark:bg-slate-700/60" />
              <div className="hidden h-4 w-24 rounded bg-slate-100 dark:bg-slate-700/60 sm:block" />
              <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
