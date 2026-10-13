'use client';

import { useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

// Must match the iconMap in src/app/contact/GeneralContact/BranchInfoCards.jsx —
// any other value renders no icon on the public card.
const ICON_OPTIONS = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Mail', label: 'Mail' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Navigation', label: 'Location' },
];

/**
 * Shared create/edit form for a contact_info card. On submit it files the
 * change through the shared moderation action `submitChange`; superadmins apply
 * immediately, data-entry queues for review.
 *
 * Fields map to the contact_info columns: icon, title (required), primary_value,
 * sort_order, is_published. A "Phone" card becomes a tel: link and a "Mail"
 * card a mailto: link on the public page.
 *
 * @param {{ mode: 'create'|'edit', cardId?: number|string, initial?: object }} props
 */
export default function ContactInfoForm({ mode = 'create', cardId, initial = {} }) {
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
    const num = (name) => {
      const v = (fd.get(name) || '').toString().trim();
      if (v === '') return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const title = text('title');
    if (!title) {
      setError('Title is required.');
      return;
    }

    const proposedData = {
      icon: text('icon'),
      title,
      primary_value: text('primary_value'),
      sort_order: num('sort_order'),
      is_published: fd.get('is_published') === 'on',
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'contact_info',
      targetId: mode === 'edit' ? cardId : null,
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
            Your {mode === 'edit' ? 'changes have' : 'new contact card has'} been saved. Superadmin
            changes go live immediately; data-entry submissions appear after a superadmin approves
            them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/contact-info"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to Contact Info
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
          {mode === 'edit' ? 'Edit contact card' : 'New contact card'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Changes are submitted for superadmin approval before they appear on the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="icon" className={label}>
              Icon
            </label>
            <select id="icon" name="icon" defaultValue={initial.icon || 'Phone'} className={field}>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort_order" className={label}>
              Sort order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={initial.sort_order ?? 0}
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className={label}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Phone, Email, Office hours"
            defaultValue={initial.title || ''}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="primary_value" className={label}>
            Value
          </label>
          <input
            id="primary_value"
            name="primary_value"
            type="text"
            placeholder="e.g. +880 1234-567890"
            defaultValue={initial.primary_value || ''}
            className={field}
          />
          <p className="mt-1 text-xs text-slate-400">
            A “Phone” card becomes a tap-to-call link and a “Mail” card a mailto: link.
          </p>
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
            href="/admin/contact-info"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
