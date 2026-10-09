'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import { approveSubmission, denySubmission } from '../_actions/content';

/**
 * Approve / Deny / Modify controls for a single pending submission.
 * - Approve applies the submission as-is.
 * - Modify reveals an editable textarea of the proposed_data; Approve then
 *   sends the edited JSON as an `override`.
 * - Deny reveals an optional note field, then rejects.
 */
export default function Review({ submission }) {
  const router = useRouter();
  const pretty = JSON.stringify(submission.proposed_data ?? {}, null, 2);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(pretty);
  const [denyOpen, setDenyOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run(fn) {
    setBusy(true);
    setError('');
    try {
      const res = await fn();
      if (res?.error) {
        setError(res.error);
        return false;
      }
      router.refresh();
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function onApprove() {
    let override;
    if (editing) {
      try {
        override = JSON.parse(draft);
      } catch {
        setError('Edited data is not valid JSON. Fix it before approving.');
        return;
      }
    }
    await run(() => approveSubmission(submission.id, override));
  }

  async function onDeny() {
    await run(() => denySubmission(submission.id, note));
  }

  const btn =
    'rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="mt-3">
      {/* proposed_data: pretty view or editable (Modify) */}
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          rows={Math.min(20, Math.max(6, draft.split('\n').length))}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      ) : (
        <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          {pretty}
        </pre>
      )}

      {error ? (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onApprove}
          disabled={busy}
          className={cx(btn, 'bg-emerald-600 text-white hover:bg-emerald-500')}
        >
          {editing ? 'Apply & Approve' : 'Approve'}
        </button>

        <button
          type="button"
          onClick={() => {
            setEditing((v) => !v);
            setError('');
            if (editing) setDraft(pretty);
          }}
          disabled={busy}
          className={cx(
            btn,
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {editing ? 'Cancel edit' : 'Modify'}
        </button>

        <button
          type="button"
          onClick={() => setDenyOpen((v) => !v)}
          disabled={busy}
          className={cx(
            btn,
            'border border-red-300 bg-white text-red-600 hover:bg-red-50 dark:border-red-800/60 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-950/40'
          )}
        >
          Deny
        </button>

        {busy ? <span className="text-sm text-slate-500 dark:text-slate-400">Working...</span> : null}
      </div>

      {denyOpen ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason (optional, shown to submitter)"
            className="min-w-[16rem] flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onDeny}
            disabled={busy}
            className={cx(btn, 'bg-red-600 text-white hover:bg-red-500')}
          >
            Confirm deny
          </button>
        </div>
      ) : null}
    </div>
  );
}
