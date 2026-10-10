'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteContent } from '../_actions/content';

/**
 * Superadmin-only delete control for a single FAQ row. Confirms, calls the
 * `deleteContent` server action, then refreshes the list.
 */
export default function DeleteFaqButton({ id, title }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onDelete() {
    const ok = window.confirm(`Delete "${title || `FAQ #${id}`}"? This cannot be undone.`);
    if (!ok) return;

    setBusy(true);
    setError('');
    try {
      const res = await deleteContent({ table: 'faqs', id });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className="rounded-md px-2.5 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        {busy ? 'Deleting...' : 'Delete'}
      </button>
      {error ? <span className="mt-0.5 text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </span>
  );
}
