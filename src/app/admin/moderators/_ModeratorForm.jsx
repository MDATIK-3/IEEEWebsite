'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';
import ImageUploader from '../_components/ImageUploader';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

/**
 * Shared create/edit form for moderator (leadership) messages. On submit it does
 * NOT write the live table; it files the change into the moderation queue via
 * `submitChange` (superadmins apply immediately, data-entry queue for approval).
 *
 * @param {{ mode: 'create'|'edit', moderatorId?: number|string, initial?: object }} props
 */
export default function ModeratorForm({ mode = 'create', moderatorId, initial = {} }) {
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

    const name = text('name');
    if (!name) {
      setError('Name is required.');
      return;
    }
    const message = text('message');
    if (!message) {
      setError('Message is required.');
      return;
    }

    const proposedData = {
      name,
      title: text('title'),
      image: text('image'),
      message,
      sort_order: Number(fd.get('sort_order')) || 0,
      is_published: fd.get('is_published') === 'on',
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'moderator_messages',
      targetId: mode === 'edit' ? moderatorId : null,
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
            Your {mode === 'edit' ? 'changes have' : 'new moderator message has'} been saved. Superadmin
            changes go live immediately; data-entry submissions appear after a superadmin approves them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/moderators"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to moderators
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
          {mode === 'edit' ? 'Edit moderator message' : 'New moderator message'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Changes are submitted for superadmin approval before they appear on the home page.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Name <span className="text-red-500">*</span>
            </label>
            <input id="name" name="name" type="text" defaultValue={initial.name || ''} className={field} />
          </div>
          <div>
            <label htmlFor="title" className={label}>
              Title / position
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={initial.title || ''}
              className={field}
              placeholder="e.g. Branch Counselor"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={label}>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            defaultValue={initial.message || ''}
            className={field}
          />
        </div>

        <ImageUploader
          name="image"
          initialUrl={initial.image || ''}
          folder="moderators"
          label="Portrait"
        />

        <div>
          <label htmlFor="sort_order" className={label}>
            Order (lower shows first)
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={initial.sort_order ?? 0}
            className={field}
          />
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
            href="/admin/moderators"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
