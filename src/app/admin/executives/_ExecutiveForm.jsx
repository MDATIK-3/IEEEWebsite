'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';
import ImageUploader from '../_components/ImageUploader';
import { COMMITTEES, GROUPS } from './_meta';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

/**
 * Shared create/edit form for executive committee members. On submit it does NOT
 * write the live table directly; it files the change into the moderation queue
 * via `submitChange` (superadmins apply immediately, data-entry goes to review).
 *
 * @param {{ mode: 'create'|'edit', executiveId?: number|string, initial?: object }} props
 */
export default function ExecutiveForm({ mode = 'create', executiveId, initial = {} }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const fd = new FormData(e.currentTarget);
    const text = (name) => {
      const v = (fd.get(name) || '').toString().trim();
      return v === '' ? null : v;
    };
    const int = (name) => {
      const v = (fd.get(name) || '').toString().trim();
      if (v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : null;
    };

    const name = text('name');
    if (!name) {
      setError('Name is required.');
      return;
    }

    const year = int('year');
    if (year === null) {
      setError('Year is required.');
      return;
    }
    if (year < 1980 || year > 2100) {
      setError('Please enter a valid year (1980–2100).');
      return;
    }

    const committee = text('committee');
    if (!committee) {
      setError('Committee is required.');
      return;
    }

    const member_group = text('member_group');
    if (!member_group) {
      setError('Member group is required.');
      return;
    }

    // Store a bare address; strip an accidental "mailto:" prefix so the public
    // site (which builds `mailto:${email}`) does not double it up.
    let email = text('email');
    if (email) {
      email = email.replace(/^mailto:/i, '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    const proposedData = {
      year,
      committee,
      member_group,
      name,
      role: text('role'),
      img: text('img'),
      facebook: text('facebook'),
      linkedin: text('linkedin'),
      email,
      sort_order: int('sort_order') ?? 0,
      is_published: fd.get('is_published') === 'on',
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'executives',
      targetId: mode === 'edit' ? executiveId : null,
      action: mode === 'edit' ? 'update' : 'create',
      proposedData,
    });
    setBusy(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800/60 dark:bg-emerald-950/30">
          <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Saved</h2>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300/90">
            Your {mode === 'edit' ? 'changes have' : 'new executive has'} been saved. Superadmin
            changes go live immediately; data-entry submissions appear after a superadmin approves
            them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/executives"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to executives
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {mode === 'edit' ? 'Edit executive' : 'New executive'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Changes are submitted for superadmin approval before they appear on the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Classification: which year / committee / group this member belongs to. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="year" className={label}>
              Year <span className="text-red-500">*</span>
            </label>
            <input
              id="year"
              name="year"
              type="number"
              inputMode="numeric"
              min={1980}
              max={2100}
              defaultValue={initial.year ?? new Date().getFullYear()}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="sort_order" className={label}>
              Sort order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              inputMode="numeric"
              defaultValue={initial.sort_order ?? 0}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="committee" className={label}>
              Committee <span className="text-red-500">*</span>
            </label>
            <select
              id="committee"
              name="committee"
              defaultValue={initial.committee || 'SB'}
              className={field}
            >
              {COMMITTEES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} ({c.value})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="member_group" className={label}>
              Group <span className="text-red-500">*</span>
            </label>
            <select
              id="member_group"
              name="member_group"
              defaultValue={initial.member_group || 'student'}
              className={field}
            >
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="name" className={label}>
            Name <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" defaultValue={initial.name || ''} className={field} />
        </div>

        <div>
          <label htmlFor="role" className={label}>
            Role / position
          </label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="e.g. Chair, Vice-chair, Branch Counselor"
            defaultValue={initial.role || ''}
            className={field}
          />
        </div>

        <ImageUploader
          name="img"
          initialUrl={initial.img || ''}
          folder="executives"
          label="Photo"
        />

        {/* Social / contact links. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              defaultValue={(initial.email || '').replace(/^mailto:/i, '')}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="linkedin" className={label}>
              LinkedIn URL
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
              defaultValue={initial.linkedin || ''}
              className={field}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="facebook" className={label}>
              Facebook URL
            </label>
            <input
              id="facebook"
              name="facebook"
              type="url"
              placeholder="https://facebook.com/…"
              defaultValue={initial.facebook || ''}
              className={field}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <label className="flex items-center gap-3">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={initial.is_published ?? true}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Published</span>
          </label>
          <p className="mt-1 pl-7 text-xs text-slate-500 dark:text-slate-400">
            Uncheck to hide this member from the public Executives page.
          </p>
        </div>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className={cx(
              'rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {busy ? 'Submitting...' : 'Submit for approval'}
          </button>
          <Link
            href="/admin/executives"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
