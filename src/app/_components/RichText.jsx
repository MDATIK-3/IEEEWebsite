import { looksLikeHtml } from '@/app/utils/richText';

/**
 * Renders admin-authored rich text on public pages.
 *
 * New content is sanitized HTML (cleaned on write in the content server action),
 * so injecting it is safe. Legacy plain-text values (authored before the WYSIWYG
 * editor) are rendered as text with line breaks preserved, so nothing regresses.
 *
 * Pure render (no hooks / no 'use client') so it works in both server and client
 * component trees. Returns null for empty input so callers can show a fallback.
 *
 * @param {{ html?: string, className?: string }} props
 */
export default function RichText({ html, className = '' }) {
  const value = typeof html === 'string' ? html : '';
  if (!value.trim()) return null;

  const cls = `richtext ${className}`.trim();

  if (looksLikeHtml(value)) {
    return <div className={cls} dangerouslySetInnerHTML={{ __html: value }} />;
  }
  return (
    <div className={cls} style={{ whiteSpace: 'pre-line' }}>
      {value}
    </div>
  );
}
