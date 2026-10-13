'use client';

import { useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';
import ImageUploader from '../_components/ImageUploader';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

/**
 * Shared create/edit form for achievements. Like the other admin content forms,
 * it does NOT write the live table directly; it files the change into the
 * moderation queue via `submitChange` (superadmins apply immediately, data-entry
 * goes to review).
 *
 * @param {{ mode: 'create'|'edit', achievementId?: number|string, initial?: object }} props
 */
export default function AchievementForm({ mode = 'create', achievementId, initial = {} }) {
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

    const program_name = text('program_name');
    if (!program_name) {
      setError('Program name is required.');
      return;
    }

    const year = int('year');
    // Year is optional in the schema, but when provided keep it sane.
    if (year !== null && (year < 1980 || year > 2100)) {
      setError('Please enter a valid year (1980–2100), or leave it blank.');
      return;
    }

    const proposedData = {
      year,
      program_name,
      details: text('details'),
      image: text('image'),
      sort_order: int('sort_order') ?? 0,
      is_published: fd.get('is_published') === 'on',
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'achievements',
      targetId: mode === 'edit' ? achievementId : null,
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
            Your {mode === 'edit' ? 'changes have' : 'new achievement has'} been saved. Superadmin
            changes go live immediately; data-entry submissions appear after a superadmin approves
            them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/achievements"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to achievements
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
          {mode === 'edit' ? 'Edit achievement' : 'New achievement'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Changes are submitted for superadmin approval before they appear on the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="program_name" className={label}>
            Program name <span className="text-red-500">*</span>
          </label>
          <input
            id="program_name"
            name="program_name"
            type="text"
            placeholder="e.g. IEEEXtreme 17.0 Global Ranking"
            defaultValue={initial.program_name || ''}
            className={field}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="year" className={label}>
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              inputMode="numeric"
              min={1980}
              max={2100}
              placeholder={String(new Date().getFullYear())}
              defaultValue={initial.year ?? ''}
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
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Lower numbers show first. Ties fall back to newest year.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="details" className={label}>
            Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder="Describe the achievement, the recognition received, and who was involved."
            defaultValue={initial.details || ''}
            className={cx(field, 'resize-y')}
          />
        </div>

        <ImageUploader
          name="image"
          initialUrl={initial.image || ''}
          folder="achievements"
          label="Image"
        />

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
            Uncheck to hide this achievement from the public Achievements page.
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
            href="/admin/achievements"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
