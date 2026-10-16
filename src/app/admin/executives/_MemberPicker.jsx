'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import { field, label } from '../_components/formStyles';
import { committeeLabel } from './_meta';

/** One-line "last role · committee year · source" hint shown under each match. */
function memberHint(m) {
  const parts = [];
  if (m.lastRole) parts.push(m.lastRole);
  const where = [m.lastCommittee ? committeeLabel(m.lastCommittee) : '', m.lastYear]
    .filter(Boolean)
    .join(' ');
  if (where) parts.push(where);
  // Flag the origin for anyone who isn't already an executive.
  if (m.source && m.source !== 'Executive') parts.push(m.source);
  return parts.join(' · ');
}

/**
 * Searchable picker over people already in the `executives` table. Selecting one
 * reuses their personal data (name/photo/socials/email) so the same person does
 * not have to be re-entered for a new branch/position — the admin only fills in
 * the position fields below. Create mode only.
 *
 * @param {{ members: object[], onPick: (m: object) => void }} props
 */
export default function MemberPicker({ members, onPick }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const boxRef = useRef(null);

  const matches = useMemo(() => {
    // Normalize case, accents and punctuation, then require every typed word to
    // appear somewhere in the haystack. This makes "md atik" match "Md. Atik",
    // "MD  ATIK" or a reversed "Atik, Md" — strict substring matching did not.
    const norm = (s) =>
      (s || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    const tokens = norm(q).split(/\s+/).filter(Boolean);
    const list = tokens.length
      ? members.filter((m) => {
          const hay = norm(`${m.name} ${m.email} ${m.lastRole} ${m.lastCommittee} ${m.source}`);
          return tokens.every((t) => hay.includes(t));
        })
      : members;
    return list.slice(0, 50);
  }, [members, q]);

  // Close when clicking outside the control.
  useEffect(() => {
    function onDocDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  function pick(m) {
    onPick(m);
    setQ('');
    setOpen(false);
  }

  return (
    <div
      ref={boxRef}
      className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20"
    >
      <span className={label}>Reuse someone already in the system</span>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        Search everyone already in the system past executives, contributors, spotlights,
        leadership messages and admin accounts to fill their name, photo and contact details, then
        just set the new year, committee, group and role below.
      </p>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search by name, email or role…"
          aria-label="Search existing members"
          className={cx(field, 'pl-9')}
        />

        {open && matches.length > 0 ? (
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {matches.map((m, i) => {
              const src = resolveImageSrc(m.img);
              const hint = memberHint(m);
              return (
                <li key={`${m.email || m.name}-${i}`}>
                  <button
                    type="button"
                    // mousedown (not click) so selection fires before the input
                    // blur / outside-click handler can tear the dropdown down.
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pick(m);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt=""
                        className="h-8 w-8 flex-none rounded-full border border-slate-200 object-cover dark:border-slate-700"
                      />
                    ) : (
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {(m.name[0] || '?').toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {m.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {[m.email, hint].filter(Boolean).join(' — ') || 'No other details'}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {open && q.trim() && matches.length === 0 ? (
          <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No one in the system matches “{q.trim()}”. They may not have been added yet — fill
            the form in manually.
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {q.trim() ? `${matches.length} of ${members.length}` : `${members.length}`}{' '}
        {members.length === 1 ? 'person' : 'people'}
        {q.trim() ? ' match' : ' available'} · click the box to browse all.
      </p>
    </div>
  );
}
