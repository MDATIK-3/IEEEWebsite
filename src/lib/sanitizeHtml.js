import 'server-only';
import sanitizeHtml from 'sanitize-html';

/**
 * Server-side sanitizer for admin-authored rich text (the WYSIWYG editor output).
 *
 * Content is cleaned on WRITE — in the content moderation server action — so the
 * database only ever stores safe markup and every render path (public pages,
 * admin preview, the chatbot) can trust it without re-sanitizing in the browser.
 *
 * The allowlist mirrors exactly what the TipTap StarterKit toolbar can produce:
 * basic inline marks, two heading levels, lists, blockquotes, links, inline code
 * and horizontal rules. Everything else (scripts, styles, iframes, event
 * handlers, class/style attributes, etc.) is stripped.
 */
const OPTIONS = {
  allowedTags: [
    'p', 'br',
    'strong', 'b', 'em', 'i', 'u', 's',
    'h1', 'h2', 'h3',
    'ul', 'ol', 'li',
    'blockquote', 'a', 'code', 'pre', 'hr',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  // Force every link to open safely in a new tab.
  transformTags: {
    a: (tagName, attribs) => ({
      tagName: 'a',
      attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' },
    }),
  },
};

/**
 * Clean a single rich-text HTML string. Non-strings pass through untouched;
 * empty / whitespace-only / empty-paragraph input normalizes to '' so empty
 * editors don't persist a stray `<p></p>`.
 *
 * @param {unknown} value
 * @returns {unknown}
 */
export function cleanRichText(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '<p></p>') return '';
  return sanitizeHtml(trimmed, OPTIONS);
}
