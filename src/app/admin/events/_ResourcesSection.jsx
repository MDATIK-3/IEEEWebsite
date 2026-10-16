'use client';

import { Plus, Trash2 } from 'lucide-react';
import { field, label } from '../_components/formStyles';

const RESOURCE_TYPES = [
  { value: 'link', label: 'Link' },
  { value: 'slides', label: 'Slides / Document' },
  { value: 'video', label: 'Video' },
  { value: 'gallery', label: 'Gallery / Drive' },
];

/**
 * Repeatable "Event Resources" editor for the event form. Stored in
 * events.resources (jsonb) as [{ label, url, type }]. State lives in the parent
 * form; this component renders the rows and calls back on add/update/remove.
 *
 * @param {{
 *   resources: Array<{ _id: string, label: string, url: string, type: string }>,
 *   onAdd: () => void,
 *   onUpdate: (id: string, patch: object) => void,
 *   onRemove: (id: string) => void,
 * }} props
 */
export default function ResourcesSection({ resources, onAdd, onUpdate, onRemove }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Event Resources
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Links shown in “Event Resources” — slides, recordings, or a Google Drive folder.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        >
          <Plus className="h-3.5 w-3.5" /> Add resource
        </button>
      </div>

      {resources.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">No resources added yet.</p>
      ) : (
        <div className="space-y-3">
          {resources.map((r, i) => (
            <div key={r._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Resource {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(r._id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
                <div>
                  <label className={label}>Label</label>
                  <input
                    type="text"
                    value={r.label}
                    onChange={(e) => onUpdate(r._id, { label: e.target.value })}
                    placeholder="e.g. Event Photos"
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>URL</label>
                  <input
                    type="url"
                    value={r.url}
                    onChange={(e) => onUpdate(r._id, { url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Type</label>
                  <select
                    value={r.type}
                    onChange={(e) => onUpdate(r._id, { type: e.target.value })}
                    className={field}
                  >
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
