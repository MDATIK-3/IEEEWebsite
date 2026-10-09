'use client';

import { useRef, useState } from 'react';
import { cx } from '@/app/utils/cx';
import { uploadImage } from '../_actions/upload';
import { UploadCloud, X, Loader2, ImageIcon } from 'lucide-react';

/**
 * Drag-and-drop / click-to-select image uploader for the admin.
 * Uploads to Supabase Storage (via the uploadImage server action) and keeps the
 * resulting public URL in a hidden input named `name`, so existing FormData
 * submit logic reads it transparently (no URL typing needed).
 *
 * @param {{ name:string, initialUrl?:string, folder?:string, label?:string }} props
 */
export default function ImageUploader({ name, initialUrl = '', folder = 'misc', label = 'Image' }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await uploadImage(fd);
      if (res?.error) setError(res.error);
      else if (res?.url) setUrl(res.url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input type="hidden" name={name} value={url} readOnly />

      {url ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="preview"
            className="h-40 w-full max-w-sm rounded-lg border border-slate-200 object-cover dark:border-slate-700"
          />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-500"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cx(
            'flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition',
            dragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-slate-300 bg-slate-50 hover:border-emerald-400 dark:border-slate-600 dark:bg-slate-900/40'
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-7 w-7 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Drag &amp; drop an image, or click to select
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <ImageIcon className="h-3.5 w-3.5" /> PNG, JPG, WEBP, AVIF or SVG · up to 10MB
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />

      {error ? (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
