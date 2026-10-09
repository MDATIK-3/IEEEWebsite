"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { cx } from "@/app/utils/cx";

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
 * below the navbar. Not dismissible. Content comes from the DB (announcements +
 * upcoming events) and is managed by admins at /admin/announcements.
 */
export default function NewsTicker({ items = [] }) {
  const list = (items || []).filter((it) => it && it.title);
  if (list.length === 0) return null;

  // Constant scroll speed regardless of item count.
  const duration = `${Math.max(20, list.length * 6)}s`;

  return (
    <>
      {/* In-flow spacer reserves the 36px bar height so the fixed bar never
          covers page content (every page already clears the 56px navbar). */}
      <div aria-hidden="true" className="h-9" />

      <div
        className={cx(
          "nt-bar fixed left-0 right-0 top-[56px] z-30 flex h-9 items-stretch overflow-hidden",
          "text-white shadow-sm text-xs sm:text-[13px]"
        )}
        role="region"
        aria-label="News highlights"
      >
        <div className="nt-badge flex shrink-0 items-center gap-1.5 px-3">
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-extrabold uppercase tracking-wider">News</span>
          <span className="nt-pulse" aria-hidden="true" />
        </div>

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
        .nt-marquee { position: relative; flex: 1 1 auto; min-width: 0; overflow: hidden; }
        .nt-track {
          display: inline-flex; align-items: center; width: max-content;
          will-change: transform; animation: nt-scroll var(--nt-duration, 40s) linear infinite;
        }
        .nt-copy { display: inline-flex; align-items: center; }
        .nt-cell { display: inline-flex; align-items: center; }
        .nt-item { display: inline-flex; align-items: center; gap: .5rem; white-space: nowrap; line-height: 1; padding-left: 1rem; }
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
          .nt-marquee { overflow-x: auto; }
          .nt-copy-dup { display: none; }
          .nt-pulse { animation: none; }
        }
      `}</style>
    </>
  );
}
