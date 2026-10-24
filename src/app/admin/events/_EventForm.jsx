'use client';

import { useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';
import ImageUploader from '../_components/ImageUploader';
import RichTextEditor from '../_components/RichTextEditor';
import { field, label } from '../_components/formStyles';
import SpeakersSection from './_SpeakersSection';
import GallerySection from './_GallerySection';
import ResourcesSection from './_ResourcesSection';

/** Stable key for a dynamic list row. */
const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

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

/**
 * Shared create/edit form for events. On submit it does NOT write the live
 * table; it files the change into the moderation queue via `submitChange`.
 *
 * The three repeatable sections (speakers, gallery, resources) live in their
 * own components; their state is owned here so it can be gathered on submit.
 *
 * @param {{ mode: 'create'|'edit', eventId?: number|string, initial?: object }} props
 */
export default function EventForm({ mode = 'create', eventId, initial = {} }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Rich-text body — TipTap is controlled by React state (not FormData), like
  // the repeatable sections below. Sanitized on save in the server action.
  const [description, setDescription] = useState(initial.description || '');

  // Featured Speakers — stored in events.speakers (jsonb). Bio lives on each
  // speaker object now; existing rows kept bios in guest_bio / special_guest_bio,
  // so seed those into the first two speakers when editing legacy data.
  const [speakers, setSpeakers] = useState(() =>
    (Array.isArray(initial.speakers) ? initial.speakers : []).map((s, i) => ({
      _id: uid(),
      name: s?.name || '',
      designation: s?.designation || s?.role || '',
      image: s?.image || '',
      bio: s?.bio || (i === 0 ? initial.guest_bio : i === 1 ? initial.special_guest_bio : '') || '',
    }))
  );

  // Event Gallery — stored in events.gallery (text[] of image URLs).
  const [gallery, setGallery] = useState(() =>
    (Array.isArray(initial.gallery) ? initial.gallery : []).map((g) => ({
      _id: uid(),
      url: typeof g === 'string' ? g : g?.image || '',
    }))
  );

  // Event Resources — stored in events.resources (jsonb) as [{label,url,type}].
  const [resources, setResources] = useState(() =>
    (Array.isArray(initial.resources) ? initial.resources : []).map((r) => ({
      _id: uid(),
      label: r?.label || '',
      url: r?.url || '',
      type: r?.type || 'link',
    }))
  );

  const addSpeaker = () =>
    setSpeakers((p) => [...p, { _id: uid(), name: '', designation: '', image: '', bio: '' }]);
  const updateSpeaker = (id, patch) =>
    setSpeakers((p) => p.map((s) => (s._id === id ? { ...s, ...patch } : s)));
  const removeSpeaker = (id) => setSpeakers((p) => p.filter((s) => s._id !== id));

  const addGalleryItem = () => setGallery((p) => [...p, { _id: uid(), url: '' }]);
  const updateGalleryItem = (id, url) =>
    setGallery((p) => p.map((g) => (g._id === id ? { ...g, url } : g)));
  const removeGalleryItem = (id) => setGallery((p) => p.filter((g) => g._id !== id));

  const addResource = () =>
    setResources((p) => [...p, { _id: uid(), label: '', url: '', type: 'link' }]);
  const updateResource = (id, patch) =>
    setResources((p) => p.map((r) => (r._id === id ? { ...r, ...patch } : r)));
  const removeResource = (id) => setResources((p) => p.filter((r) => r._id !== id));

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
      description: description || null,
      event_type: text('event_type'),
      organizer: text('organizer'),
      starts_at: fromLocalInput(fd.get('starts_at')),
      ends_at: fromLocalInput(fd.get('ends_at')),
      location_label: text('location_label'),
      image_url: text('image_url'),
      registration_link: text('registration_link'),
      is_published: fd.get('is_published') === 'on',
      publish_at: fromLocalInput(fd.get('publish_at')),
      // Repeatable sections are managed in React state (not FormData) because
      // they include image uploaders and a dynamic row count.
      speakers: speakers
        .map((s) => ({
          name: (s.name || '').trim(),
          designation: (s.designation || '').trim(),
          image: (s.image || '').trim(),
          bio: (s.bio || '').trim(),
        }))
        .filter((s) => s.name || s.image || s.bio),
      gallery: gallery.map((g) => (g.url || '').trim()).filter(Boolean),
      resources: resources
        .map((r) => ({
          label: (r.label || '').trim(),
          url: (r.url || '').trim(),
          type: (r.type || 'link').trim() || 'link',
        }))
        .filter((r) => r.label && r.url),
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
          <RichTextEditor
            label="Description"
            value={description}
            onChange={setDescription}
            help="Use the toolbar for headings, bold, lists and links."
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

        <SpeakersSection
          speakers={speakers}
          onAdd={addSpeaker}
          onUpdate={updateSpeaker}
          onRemove={removeSpeaker}
        />

        <GallerySection
          gallery={gallery}
          onAdd={addGalleryItem}
          onUpdate={updateGalleryItem}
          onRemove={removeGalleryItem}
        />

        <ResourcesSection
          resources={resources}
          onAdd={addResource}
          onUpdate={updateResource}
          onRemove={removeResource}
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
