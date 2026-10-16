'use client';

import { Plus, Trash2 } from 'lucide-react';
import ImageUploader from '../_components/ImageUploader';

/**
 * Repeatable "Event Gallery" editor for the event form. Stored in
 * events.gallery (text[] of image URLs). State lives in the parent form; this
 * component renders the uploaders and calls back on add/update/remove.
 *
 * @param {{
 *   gallery: Array<{ _id: string, url: string }>,
 *   onAdd: () => void,
 *   onUpdate: (id: string, url: string) => void,
 *   onRemove: (id: string) => void,
 * }} props
 */
export default function GallerySection({ gallery, onAdd, onUpdate, onRemove }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Event Gallery</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Photos shown in the gallery on the event page (after the event date passes).
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        >
          <Plus className="h-3.5 w-3.5" /> Add photo
        </button>
      </div>

      {gallery.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">No gallery photos added yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {gallery.map((g, i) => (
            <div key={g._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Photo {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(g._id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <ImageUploader
                initialUrl={g.url}
                folder="events/gallery"
                label=""
                onChange={(url) => onUpdate(g._id, url)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
