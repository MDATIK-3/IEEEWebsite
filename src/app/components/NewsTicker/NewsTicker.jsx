"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { cx } from "@/app/utils/cx";

const DEFAULT_ENDPOINT = "/api/announcements/ticker";
const DEFAULT_REFRESH_MS = 60_000; // bounds how soon a scheduled item appears
const MAX_TIMEOUT_MS = 2_147_000_000; // setTimeout caps at ~24.8 days
const SCROLL_SPEED = 70; // px/sec — constant crawl speed regardless of item count

// Measure synchronously before paint on the client; fall back to a no-op effect
// during SSR so React doesn't warn about useLayoutEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function normalize(list) {
  return (Array.isArray(list) ? list : [])
    .filter((it) => it && it.title)
    .map((it) => ({
      title: it.title,
      href: it.href ?? it.link_url ?? null,
      variant: it.variant || "info",
      endsAt: it.endsAt ?? it.ends_at ?? null,
    }));
}

function Cells({ list, keyPrefix }) {
  return list.map((item, i) => {
    const body = (
      <span className="nt-item">
        <span className="nt-dot" aria-hidden="true" />
        <span className="nt-title">{item.title}</span>
      </span>
    );
    return (
      <span className="nt-cell" key={`${keyPrefix}-${i}`}>
        {item.href ? (
          <Link href={item.href} className="nt-link">
            {body}
          </Link>
        ) : (
          body
        )}
        <span className="nt-sep" aria-hidden="true" />
      </span>
    );
  });
}

/**
 * Site-wide news highlighter: a red, eye-catching single-line bar fixed just
 * below the navbar. Not dismissible. Content comes from admin-managed
 * announcements (/admin/announcements).
 *
 * Motion: a continuously scrolling marquee built from two identical copies that
 * loop seamlessly (translateX 0 → -50%). Each copy is forced to at least the
 * bar's width, so even one short item scrolls as a single continuous pass
 * (item → gap → item) instead of showing two static copies side by side. Speed
 * is constant (px/sec) no matter how many items there are.
 *
 * Scheduling: seeded with the server-rendered items, then kept in sync with
 * `/api/announcements/ticker` (a dynamic, uncached feed) so items appear on
 * their `starts_at` and vanish on their `ends_at` without depending on the
 * cached page HTML. Expiry is also enforced client-side to the second.
 */
export default function NewsTicker({
  items: initialItems = [],
  endpoint = DEFAULT_ENDPOINT,
  refreshMs = DEFAULT_REFRESH_MS,
}) {
  const [items, setItems] = useState(() => normalize(initialItems));
  const [now, setNow] = useState(() => Date.now());
  const [containerW, setContainerW] = useState(0);
  const [groupW, setGroupW] = useState(0);
  const [barH, setBarH] = useState(0);
  const barRef = useRef(null);
  const marqueeRef = useRef(null);
  const copyRef = useRef(null);

  const refresh = useCallback(
    async (signal) => {
      try {
        const res = await fetch(endpoint, { cache: "no-store", signal });
        if (!res.ok) return; // keep last-known items on a bad response
        const data = await res.json();
        setItems(normalize(data?.items));
        setNow(Date.now());
      } catch {
        // Network/abort error: keep showing what we already have.
      }
    },
    [endpoint]
  );

  // Poll while the tab is visible, and refetch immediately on refocus.
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const controller = new AbortController();
    const poll = () => {
      if (document.visibilityState === "visible") refresh(controller.signal);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        refresh(controller.signal);
      }
    };
    const id = setInterval(poll, refreshMs);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      controller.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh, refreshMs]);

  const visible = useMemo(
    () => items.filter((it) => !it.endsAt || new Date(it.endsAt).getTime() > now),
    [items, now]
  );

  // Fire a tick exactly when the next item expires, so it drops off on time.
  useEffect(() => {
    const upcoming = items
      .map((it) => (it.endsAt ? new Date(it.endsAt).getTime() : NaN))
      .filter((t) => Number.isFinite(t) && t > Date.now());
    if (upcoming.length === 0) return undefined;
    const delay = Math.min(Math.min(...upcoming) - Date.now() + 50, MAX_TIMEOUT_MS);
    const id = setTimeout(() => setNow(Date.now()), Math.max(0, delay));
    return () => clearTimeout(id);
  }, [items, now]);

  // Track the bar width so each copy can be forced to at least fill it, and the
  // bar height so the in-flow spacer can reserve exactly the right amount of
  // room (the bar is position:fixed and grows with the font size).
  useEffect(() => {
    const marquee = marqueeRef.current;
    const bar = barRef.current;
    if (typeof ResizeObserver === "undefined") return undefined;
    let raf = 0;
    // Defer reads/writes to the next frame and only update on an actual change.
    // This is the standard guard against the "ResizeObserver loop completed
    // with undelivered notifications" warning (which, in dev, floods the
    // Next.js error overlay / __nextjs_original-stack-frames endpoint).
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (marquee) setContainerW((w) => (w === marquee.clientWidth ? w : marquee.clientWidth));
        if (bar) setBarH((h) => (h === bar.offsetHeight ? h : bar.offsetHeight));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (marquee) ro.observe(marquee);
    if (bar) ro.observe(bar);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Measure one loop copy (after its min-width is applied) to set a constant
  // crawl speed. Only affects the animation duration, never layout width.
  useIsoLayoutEffect(() => {
    const el = copyRef.current;
    if (el) setGroupW((g) => (g === el.offsetWidth ? g : el.offsetWidth));
  }, [visible, containerW]);

  const duration = `${Math.max(18, Math.round((groupW || containerW || 600) / SCROLL_SPEED))}s`;
  const copyMin = containerW ? `${containerW}px` : "0px";

  if (visible.length === 0) return null;

  return (
    <>
      {/* In-flow spacer reserves the (measured) bar height so the fixed bar
          never covers page content (every page already clears the 56px navbar).
          Falls back to 40px before the bar is measured / during SSR. */}
      <div aria-hidden="true" style={{ height: `${barH || 40}px` }} />

      <div
        ref={barRef}
        className={cx(
          "nt-bar fixed left-0 right-0 top-[56px] z-30 flex items-stretch overflow-hidden",
          "text-white shadow-sm text-base sm:text-lg"
        )}
        role="region"
        aria-label="News highlights"
      >
        <div className="nt-badge flex shrink-0 items-center gap-1.5 px-3">
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-extrabold uppercase tracking-wider">News</span>
          <span className="nt-pulse" aria-hidden="true" />
        </div>

        <div className="nt-marquee" ref={marqueeRef}>
          <div className="nt-fade nt-fade-l" aria-hidden="true" />
          <div
            className="nt-track"
            style={{ "--nt-duration": duration, "--nt-copy-min": copyMin }}
          >
            <div className="nt-copy" ref={copyRef}>
              <Cells list={visible} keyPrefix="a" />
            </div>
            <div className="nt-copy nt-copy-dup" aria-hidden="true">
              <Cells list={visible} keyPrefix="b" />
            </div>
          </div>
          <div className="nt-fade nt-fade-r" aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .nt-bar { --nt-bg: #dc2626; background: #dc2626; }
        .dark .nt-bar { --nt-bg: #b91c1c; background: #b91c1c; }
        .nt-badge { background: rgba(0,0,0,0.22); }
        .nt-pulse {
          width: .5rem; height: .5rem; border-radius: 9999px; background: #fff;
          animation: nt-pulse 1.6s ease-out infinite;
        }
        @keyframes nt-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,.65); }
          70% { box-shadow: 0 0 0 .45rem rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        /* Flexbox centering keeps the scrolling text vertically centred in the bar. */
        .nt-marquee { position: relative; display: flex; align-items: center; flex: 1 1 auto; min-width: 0; overflow: hidden; }
        .nt-track {
          display: inline-flex; align-items: center; flex: none; width: max-content;
          will-change: transform; animation: nt-scroll var(--nt-duration, 40s) linear infinite;
        }
        /* Each copy fills at least the bar width, so a single short item scrolls
           as one continuous pass rather than appearing twice side by side. */
        .nt-copy { display: inline-flex; align-items: center; min-width: var(--nt-copy-min, 0); }
        .nt-cell { display: inline-flex; align-items: center; }
        /* Equal top/bottom padding makes the bar grow with the font and keeps
           the text vertically centred at any size. */
        .nt-item { display: inline-flex; align-items: center; gap: .5rem; white-space: nowrap; line-height: 1; padding-left: 1rem; padding-block: .5rem; }
        .nt-title { white-space: nowrap; font-weight: 500; }
        .nt-dot { display: inline-block; width: .4rem; height: .4rem; border-radius: 9999px; background: rgba(255,255,255,.85); flex: none; }
        .nt-sep { display: inline-block; width: 1px; height: .9rem; margin-inline: 1rem; background: #fff; opacity: .35; }
        .nt-link { color: inherit; text-decoration: none; }
        .nt-link:hover .nt-title { text-decoration: underline; }
        .nt-fade { position: absolute; top: 0; bottom: 0; width: 1.5rem; pointer-events: none; z-index: 2; }
        .nt-fade-l { left: 0; background: linear-gradient(to right, var(--nt-bg), transparent); }
        .nt-fade-r { right: 0; background: linear-gradient(to left, var(--nt-bg), transparent); }
        .nt-bar:hover .nt-track, .nt-bar:focus-within .nt-track { animation-play-state: paused; }
        @keyframes nt-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .nt-track { animation: none !important; transform: none !important; width: 100%; }
          .nt-copy { min-width: 0 !important; }
          .nt-marquee { overflow-x: auto; }
          .nt-copy-dup { display: none; }
          .nt-pulse { animation: none; }
        }
      `}</style>
    </>
  );
}
