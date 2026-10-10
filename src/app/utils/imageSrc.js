/**
 * Normalizes an image value from the database into a usable <Image>/<img> src.
 *
 * Images may be stored as:
 *   - absolute URLs (Supabase Storage public URLs after the image migration, or
 *     any external host): "https://xxx.supabase.co/storage/..." — use as-is
 *   - protocol-relative or data URIs — use as-is
 *   - legacy local paths relative to /public: "images/foo.png" — prefix with "/"
 *   - already-rooted local paths: "/images/foo.png" — use as-is
 *
 * The old `src.startsWith('/') ? src : `/${src}`` logic corrupted absolute URLs
 * into "/https://..." which never loads; this preserves them.
 *
 * @param {string | null | undefined} src
 * @returns {string} normalized src ('' when no usable value)
 */
export function resolveImageSrc(src) {
  if (!src || typeof src !== 'string') return '';
  const v = src.trim();
  if (v === '') return '';
  if (/^(https?:)?\/\//i.test(v) || v.startsWith('/') || v.startsWith('data:')) return v;
  return `/${v}`;
}
