'use client';

import { Plus, Trash2 } from 'lucide-react';
import ImageUploader from '../_components/ImageUploader';
import { field, label } from '../_components/formStyles';

/**
 * Repeatable "Featured Speakers" editor for the event form. Stored in
 * events.speakers (jsonb). State lives in the parent form; this component only
 * renders the rows and calls back on add/update/remove.
 *
 * @param {{
 *   speakers: Array<{ _id: string, name: string, designation: string, image: string, bio: string }>,
 *   onAdd: () => void,
 *   onUpdate: (id: string, patch: object) => void,
 *   onRemove: (id: string) => void,
 * }} props
 */
export default function SpeakersSection({ speakers, onAdd, onUpdate, onRemove }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Featured Speakers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shown in the “Featured Speakers” section on the event page.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        >
          <Plus className="h-3.5 w-3.5" /> Add speaker
        </button>
      </div>

      {speakers.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">No speakers added yet.</p>
      ) : (
        <div className="space-y-4">
          {speakers.map((s, i) => (
            <div key={s._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Speaker {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(s._id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Name</label>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => onUpdate(s._id, { name: e.target.value })}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Designation</label>
                  <input
                    type="text"
                    value={s.designation}
                    onChange={(e) => onUpdate(s._id, { designation: e.target.value })}
                    placeholder="e.g. Keynote Speaker"
                    className={field}
                  />
                </div>
              </div>
              <div className="mt-3">
                <ImageUploader
                  initialUrl={s.image}
                  folder="events/speakers"
                  label="Photo"
                  onChange={(url) => onUpdate(s._id, { image: url })}
                />
              </div>
              <div className="mt-3">
                <label className={label}>Bio</label>
                <textarea
                  rows={3}
                  value={s.bio}
                  onChange={(e) => onUpdate(s._id, { bio: e.target.value })}
                  className={field}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
