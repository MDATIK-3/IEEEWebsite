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
 * Shared create/edit form for member spotlights. On submit it does NOT write the
 * live table; it files the change into the moderation queue via `submitChange`
 * (superadmins apply immediately, data-entry queue for approval).
 *
 * The three social links are stored together in the `socials` jsonb column as
 * { facebook, linkedin, github } — only non-empty handles are kept.
 *
 * @param {{ mode: 'create'|'edit', spotlightId?: number|string, initial?: object }} props
 */
export default function SpotlightForm({ mode = 'create', spotlightId, initial = {} }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const socials = initial.socials || {};

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

    // Keep only the social links that were filled in.
    const nextSocials = {};
    for (const key of ['facebook', 'linkedin', 'github']) {
      const url = text(key);
      if (url) nextSocials[key] = url;
    }

    const proposedData = {
      name,
      role: text('role'),
      quote: text('quote'),
      photo: text('photo'),
      socials: nextSocials,
      is_published: fd.get('is_published') === 'on',
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'spotlights',
      targetId: mode === 'edit' ? spotlightId : null,
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
            Your {mode === 'edit' ? 'changes have' : 'new spotlight has'} been saved. Superadmin
            changes go live immediately; data-entry submissions appear after a superadmin approves them.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/admin/spotlights"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Back to spotlights
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
          {mode === 'edit' ? 'Edit spotlight' : 'New spotlight'}
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
            <label htmlFor="role" className={label}>
              Role / position
            </label>
            <input
              id="role"
              name="role"
              type="text"
              defaultValue={initial.role || ''}
              className={field}
              placeholder="e.g. Vice Chair, 2024"
            />
          </div>
        </div>

        <div>
          <label htmlFor="quote" className={label}>
            Quote
          </label>
          <textarea
            id="quote"
            name="quote"
            rows={4}
            defaultValue={initial.quote || ''}
            className={field}
            placeholder="A short story or testimonial in their own words."
          />
        </div>

        <ImageUploader
          name="photo"
          initialUrl={initial.photo || ''}
          folder="spotlights"
          label="Photo"
        />

        <fieldset className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Social links <span className="font-normal text-slate-400">(optional)</span>
          </legend>
          <div className="mt-2 space-y-4">
            <div>
              <label htmlFor="facebook" className={label}>
                Facebook
              </label>
              <input
                id="facebook"
                name="facebook"
                type="url"
                defaultValue={socials.facebook || ''}
                className={field}
                placeholder="https://facebook.com/username"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className={label}>
                LinkedIn
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                defaultValue={socials.linkedin || ''}
                className={field}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label htmlFor="github" className={label}>
                GitHub
              </label>
              <input
                id="github"
                name="github"
                type="url"
                defaultValue={socials.github || ''}
                className={field}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </fieldset>

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
            href="/admin/spotlights"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
