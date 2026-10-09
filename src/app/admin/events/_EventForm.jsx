'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';
import ImageUploader from '../_components/ImageUploader';

/** ISO timestamp -> value for <input type="datetime-local"> (local time). */
function toLocalInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

/** datetime-local value -> ISO string (or null when empty). */
function fromLocalInput(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

/**
 * Shared create/edit form for events. On submit it does NOT write the live
 * table; it files the change into the moderation queue via `submitChange`.
 *
 * @param {{ mode: 'create'|'edit', eventId?: number|string, initial?: object }} props
 */
export default function EventForm({ mode = 'create', eventId, initial = {} }) {
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

    const title = text('title');
    if (!title) {
      setError('Title is required.');
      return;
    }

    const proposedData = {
      title,
      description: text('description'),
      event_type: text('event_type'),
      organizer: text('organizer'),
      starts_at: fromLocalInput(fd.get('starts_at')),
      ends_at: fromLocalInput(fd.get('ends_at')),
      location_label: text('location_label'),
      image_url: text('image_url'),
      registration_link: text('registration_link'),
      is_published: fd.get('is_published') === 'on',
      publish_at: fromLocalInput(fd.get('publish_at')),
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'events',
      targetId: mode === 'edit' ? eventId : null,
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
          <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
            Saved
          </h2>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300/90">
            Your {mode === 'edit' ? 'changes have' : 'new event has'} been saved. Superadmin changes
            go live immediately (scheduled by “Publish at”); data-entry submissions appear after a
            superadmin approves them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/events"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to events
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
          {mode === 'edit' ? 'Edit event' : 'New event'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Changes are submitted for superadmin approval before they appear on the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className={label}>
            Title <span className="text-red-500">*</span>
          </label>
          <input id="title" name="title" type="text" defaultValue={initial.title || ''} className={field} />
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial.description || ''}
            className={field}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="event_type" className={label}>
              Event type
            </label>
            <input
              id="event_type"
              name="event_type"
              type="text"
              defaultValue={initial.event_type || ''}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="organizer" className={label}>
              Organizer
            </label>
            <input
              id="organizer"
              name="organizer"
              type="text"
              defaultValue={initial.organizer || ''}
              className={field}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="starts_at" className={label}>
              Starts at
            </label>
            <input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={toLocalInput(initial.starts_at)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="ends_at" className={label}>
              Ends at
            </label>
            <input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toLocalInput(initial.ends_at)}
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="location_label" className={label}>
            Location
          </label>
          <input
            id="location_label"
            name="location_label"
            type="text"
            defaultValue={initial.location_label || ''}
            className={field}
          />
        </div>

        <ImageUploader
          name="image_url"
          initialUrl={initial.image_url || ''}
          folder="events"
          label="Event image"
        />

        <div>
          <label htmlFor="registration_link" className={label}>
            Registration link
          </label>
          <input
            id="registration_link"
            name="registration_link"
            type="url"
            defaultValue={initial.registration_link || ''}
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
          <div className="mt-4">
            <label htmlFor="publish_at" className={label}>
              Publish at <span className="font-normal text-slate-400">(leave empty for immediate)</span>
            </label>
            <input
              id="publish_at"
              name="publish_at"
              type="datetime-local"
              defaultValue={toLocalInput(initial.publish_at)}
              className={field}
            />
          </div>
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
            href="/admin/events"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
