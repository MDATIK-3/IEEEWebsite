"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cx } from "@/app/utils/cx";

const STORAGE_KEY = "ieee-news-ticker-dismissed";

/** Small coloured dot per announcement/event `variant`. Falls back to emerald. */
function dotClass(variant) {
  switch (variant) {
    case "info":
      return "bg-sky-500";
    case "warning":
    case "warn":
      return "bg-amber-500";
    case "success":
      return "bg-green-500";
    case "danger":
    case "error":
    case "alert":
      return "bg-rose-500";
    case "event":
      return "bg-emerald-500";
    default:
      return "bg-emerald-500";
  }
}

function Cells({ list, keyPrefix }) {
  return list.map((item, i) => {
    const body = (
      <span className="nt-item">
        <span className={cx("nt-dot", dotClass(item.variant))} aria-hidden="true" />
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

export default function NewsTicker({ items = [] }) {
  const [dismissed, setDismissed] = useState(false);

  // Read the saved dismissal after mount so the first client render matches the
  // server (avoids hydration mismatch); storage may throw, so guard every access.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {
      /* storage unavailable (private mode, blocked) — keep the bar visible */
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore — dismissal just won't persist */
    }
  };

  const list = (items || []).filter((it) => it && it.title);
  if (dismissed || list.length === 0) return null;

  // Keep a constant scroll speed regardless of how many items there are.
  const duration = `${Math.max(20, list.length * 6)}s`;

  return (
    <>
      {/* In-flow spacer: reserves the ticker's height so the fixed bar below the
          navbar never covers page content. Collapses with the bar on dismiss. */}
      <div aria-hidden="true" className="h-9" />

      <div
        className={cx(
          "nt-bar fixed left-0 right-0 top-[56px] z-30 flex h-9 items-center overflow-hidden",
          "border-b border-emerald-600/15 bg-emerald-50/95 text-emerald-950 backdrop-blur-sm",
          "text-xs sm:text-[13px]",
          "dark:border-emerald-400/15 dark:bg-emerald-950/80 dark:text-emerald-50"
        )}
        role="region"
        aria-label="Announcements"
      >
        <div className="nt-marquee">
          <div className="nt-fade nt-fade-l" aria-hidden="true" />
          <div className="nt-track" style={{ "--nt-duration": duration }}>
            <div className="nt-copy">
              <Cells list={list} keyPrefix="a" />
            </div>
            <div className="nt-copy nt-copy-dup" aria-hidden="true">
              <Cells list={list} keyPrefix="b" />
            </div>
          </div>
          <div className="nt-fade nt-fade-r" aria-hidden="true" />
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcements"
          className={cx(
            "nt-dismiss relative z-[3] flex h-9 w-9 shrink-0 items-center justify-center",
            "text-emerald-700/70 transition-colors hover:bg-emerald-500/10 hover:text-emerald-900",
            "dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        .nt-bar { --nt-bg: #ecfdf5; }
        .dark .nt-bar { --nt-bg: #022c22; }

        .nt-marquee {
          position: relative;
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
        }
        .nt-track {
          display: inline-flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: nt-scroll var(--nt-duration, 40s) linear infinite;
        }
        .nt-copy { display: inline-flex; align-items: center; }
        .nt-cell { display: inline-flex; align-items: center; }
        .nt-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          line-height: 1;
        }
        .nt-title { white-space: nowrap; }
        .nt-dot {
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 9999px;
          flex: none;
        }
        .nt-sep {
          display: inline-block;
          width: 1px;
          height: 0.85rem;
          margin-inline: 1.25rem;
          background: currentColor;
          opacity: 0.25;
        }
        .nt-link { color: inherit; text-decoration: none; font-weight: 500; }
        .nt-link:hover .nt-title { text-decoration: underline; }

        .nt-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2rem;
          pointer-events: none;
          z-index: 2;
        }
        .nt-fade-l { left: 0; background: linear-gradient(to right, var(--nt-bg), transparent); }
        .nt-fade-r { right: 0; background: linear-gradient(to left, var(--nt-bg), transparent); }

        /* Pause while a pointer is over the bar or focus is inside it. */
        .nt-bar:hover .nt-track,
        .nt-bar:focus-within .nt-track { animation-play-state: paused; }

        @keyframes nt-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* No motion: static, horizontally scrollable single row. */
        @media (prefers-reduced-motion: reduce) {
          .nt-track { animation: none !important; transform: none !important; width: 100%; }
          .nt-marquee { overflow-x: auto; }
          .nt-copy-dup { display: none; }
        }
      `}</style>
    </>
  );
}
