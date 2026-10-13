'use client';

import { useState } from 'react';
import Link from '@/app/admin/_components/Link';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { submitChange } from '../_actions/content';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const label = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

/** string[] -> textarea value (one item per line). */
function linesToText(arr) {
  if (!Array.isArray(arr)) return '';
  return arr.join('\n');
}

/** textarea value -> string[] (trim each line, drop empties). */
function textToLines(value) {
  return String(value ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Normalize an incoming object array to a fixed shape, falling back to one empty row. */
function toRows(arr, shape) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map((item) => {
      const row = {};
      for (const key of Object.keys(shape)) row[key] = item?.[key] ?? '';
      return row;
    });
  }
  return [{ ...shape }];
}

/**
 * Editor for the membership singleton (`membership_info`, id = 1).
 *
 * - benefits / steps are edited as textareas (one item per line) and stored as string[].
 * - fees ({ label, value }) and faqs ({ question, answer }) are repeatable rows
 *   managed in local state, stored as arrays of objects.
 *
 * On submit the change is filed through the shared moderation action
 * `submitChange`; superadmins apply immediately, data-entry queues for review.
 *
 * @param {{ initial?: object }} props
 */
export default function MembershipForm({ initial = {} }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [fees, setFees] = useState(() => toRows(initial.fees, { label: '', value: '' }));
  const [faqs, setFaqs] = useState(() => toRows(initial.faqs, { question: '', answer: '' }));

  // --- fees row handlers ---
  const updateFee = (i, key, val) =>
    setFees((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addFee = () => setFees((prev) => [...prev, { label: '', value: '' }]);
  const removeFee = (i) => setFees((prev) => prev.filter((_, idx) => idx !== i));

  // --- faqs row handlers ---
  const updateFaq = (i, key, val) =>
    setFaqs((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addFaq = () => setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  const removeFaq = (i) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const fd = new FormData(e.currentTarget);
    const text = (name) => {
      const v = (fd.get(name) || '').toString().trim();
      return v === '' ? null : v;
    };

    // benefits / steps: split on newlines, trim, drop empties -> string[]
    const benefits = textToLines(fd.get('benefits'));
    const steps = textToLines(fd.get('steps'));

    // fees / faqs: trim fields, drop rows where every field is empty -> object[]
    const cleanFees = fees
      .map((f) => ({ label: (f.label || '').trim(), value: (f.value || '').trim() }))
      .filter((f) => f.label !== '' || f.value !== '');
    const cleanFaqs = faqs
      .map((f) => ({ question: (f.question || '').trim(), answer: (f.answer || '').trim() }))
      .filter((f) => f.question !== '' || f.answer !== '');

    const proposedData = {
      join_link: text('join_link'),
      local_contact_link: text('local_contact_link'),
      benefits,
      steps,
      fees: cleanFees,
      faqs: cleanFaqs,
    };

    setBusy(true);
    const res = await submitChange({
      targetTable: 'membership_info',
      targetId: 1,
      action: 'update',
      proposedData,
    });
    setBusy(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Membership</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit the membership page content. Changes are submitted for superadmin approval before
          they appear on the site.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="join_link" className={label}>
              Join link
            </label>
            <input
              id="join_link"
              name="join_link"
              type="text"
              defaultValue={initial.join_link || ''}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="local_contact_link" className={label}>
              Local contact link
            </label>
            <input
              id="local_contact_link"
              name="local_contact_link"
              type="text"
              defaultValue={initial.local_contact_link || ''}
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="benefits" className={label}>
            Benefits <span className="font-normal text-slate-400">(one per line)</span>
          </label>
          <textarea
            id="benefits"
            name="benefits"
            rows={5}
            defaultValue={linesToText(initial.benefits)}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="steps" className={label}>
            Steps <span className="font-normal text-slate-400">(one per line)</span>
          </label>
          <textarea
            id="steps"
            name="steps"
            rows={5}
            defaultValue={linesToText(initial.steps)}
            className={field}
          />
        </div>

        {/* Fees: repeatable { label, value } */}
        <fieldset className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fees</legend>
            <button
              type="button"
              onClick={addFee}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              <Plus className="h-4 w-4" /> Add fee
            </button>
          </div>

          {fees.length === 0 ? (
            <p className="text-sm text-slate-400">No fees. Click “Add fee” to create one.</p>
          ) : null}

          <div className="space-y-3">
            {fees.map((fee, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    aria-label={`Fee ${i + 1} label`}
                    placeholder="Label (e.g. Student member)"
                    value={fee.label}
                    onChange={(e) => updateFee(i, 'label', e.target.value)}
                    className={field}
                  />
                  <input
                    type="text"
                    aria-label={`Fee ${i + 1} value`}
                    placeholder="Value (e.g. $27 / year)"
                    value={fee.value}
                    onChange={(e) => updateFee(i, 'value', e.target.value)}
                    className={field}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFee(i)}
                  aria-label={`Remove fee ${i + 1}`}
                  className="mt-1 rounded-md p-1.5 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* FAQs: repeatable { question, answer } */}
        <fieldset className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">FAQs</legend>
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              <Plus className="h-4 w-4" /> Add FAQ
            </button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-sm text-slate-400">No FAQs. Click “Add FAQ” to create one.</p>
          ) : null}

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    aria-label={`FAQ ${i + 1} question`}
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    className={field}
                  />
                  <textarea
                    rows={2}
                    aria-label={`FAQ ${i + 1} answer`}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                    className={field}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  aria-label={`Remove FAQ ${i + 1}`}
                  className="mt-1 rounded-md p-1.5 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </fieldset>

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
            {busy ? 'Saving...' : 'Save membership'}
          </button>
          <Link
            href="/admin"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
