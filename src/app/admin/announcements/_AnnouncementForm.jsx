'use client';

import { useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { useRouter } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';

function toLocalInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function AnnouncementForm({ mode = 'create', id, initial = {} }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const title = (fd.get('title') || '').toString().trim();
    if (!title) {
      setError('News text is required.');
      return;
    }

    const startsAt = fromLocalInput(fd.get('starts_at'));
    const endsAt = fromLocalInput(fd.get('ends_at'));
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      setError('“Show until” must be after “Show from”.');
      return;
    }

    const data = {
      title,
      link_url: (fd.get('link_url') || '').toString().trim() || null,
      link_label: (fd.get('link_label') || '').toString().trim() || null,
      variant: fd.get('variant') || 'info',
      priority: Number(fd.get('priority')) || 0,
      is_active: fd.get('is_active') === 'on',
      // ends_at is nullable; null = no expiry.
      ends_at: endsAt,
    };
    // starts_at: null = publish immediately. On create we omit it when empty so
    // the row is valid even before migration 0003 makes the column nullable; on
    // edit we send it (incl. null) so clearing the field takes effect.
    if (mode === 'edit' || startsAt) {
      data.starts_at = startsAt;
    }

    setBusy(true);
    const res = await submitChange({
      targetTable: 'announcements',
      targetId: mode === 'edit' ? id : null,
      action: mode === 'edit' ? 'update' : 'create',
      proposedData: data,
    });
    setBusy(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push('/admin/announcements');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {mode === 'edit' ? 'Edit news item' : 'New news item'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Active items appear in the red news highlighter at the top of the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className={label}>
            News text <span className="text-red-500">*</span>
          </label>
          <input id="title" name="title" type="text" defaultValue={initial.title || ''} className={field} placeholder="e.g. Registration open for the AI workshop" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="link_url" className={label}>Link URL (optional)</label>
            <input id="link_url" name="link_url" type="text" defaultValue={initial.link_url || ''} className={field} placeholder="/Activities/Events or https://…" />
          </div>
          <div>
            <label htmlFor="link_label" className={label}>Link label (optional)</label>
            <input id="link_label" name="link_label" type="text" defaultValue={initial.link_label || ''} className={field} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="variant" className={label}>Style</label>
            <select id="variant" name="variant" defaultValue={initial.variant || 'info'} className={field}>
              <option value="info">Info</option>
              <option value="event">Event</option>
              <option value="alert">Alert</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className={label}>Priority (higher shows first)</label>
            <input id="priority" name="priority" type="number" defaultValue={initial.priority ?? 0} className={field} />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="starts_at" className={label}>Show from (optional)</label>
              <input id="starts_at" name="starts_at" type="datetime-local" defaultValue={toLocalInput(initial.starts_at)} className={field} />
            </div>
            <div>
              <label htmlFor="ends_at" className={label}>Show until (optional)</label>
              <input id="ends_at" name="ends_at" type="datetime-local" defaultValue={toLocalInput(initial.ends_at)} className={field} />
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            The item appears automatically at “Show from” (leave empty to publish immediately) and
            disappears at “Show until” (leave empty to keep it until you hide or delete it). Times use your
            browser’s timezone.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <input name="is_active" type="checkbox" defaultChecked={initial.is_active ?? true} className="h-4 w-4 rounded border-slate-300 accent-emerald-600 dark:border-slate-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active (visible in the ticker)</span>
        </label>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
        ) : null}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={busy} className={cx('rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500', 'disabled:cursor-not-allowed disabled:opacity-50')}>
            {busy ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create'}
          </button>
          <Link href="/admin/announcements" className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
