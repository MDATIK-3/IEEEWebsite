'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteContent } from '../_actions/content';
import ConfirmDialog from '../_components/ConfirmDialog';

/**
 * Superadmin-only delete control for a single collaboration row.
 *
 * Uses the accessible in-app confirmation dialog (not window.confirm/alert),
 * runs the delete inside a transition so the row stays responsive, shows inline
 * errors, and refreshes the list from the server on success.
 */
export default function DeleteCollaborationButton({ id, name }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function onConfirm() {
    setError('');
    startTransition(async () => {
      const res = await deleteContent({ table: 'collaborations', id });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setConfirming(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="inline-flex flex-col items-end">
        <button
          type="button"
          onClick={() => {
            setError('');
            setConfirming(true);
          }}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
          aria-label={name ? `Delete ${name}` : 'Delete collaboration'}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
          Delete
        </button>
        {error ? (
          <span role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {error}
          </span>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirming}
        tone="danger"
        title="Delete this collaboration?"
        description={
          <>
            {name ? (
              <>
                “<span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>” will
                be permanently removed from the site.
              </>
            ) : (
              'This collaboration will be permanently removed from the site.'
            )}{' '}
            This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        busy={isPending}
        onConfirm={onConfirm}
        onCancel={() => !isPending && setConfirming(false)}
      />
    </>
  );
}
