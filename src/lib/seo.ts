import type { Metadata } from 'next';

/**
 * Centralized SEO helpers so every public page ships a unique, correct set of
 * metadata instead of inheriting the root layout's homepage values.
 *
 * Why this matters: in the App Router, a page that doesn't set `alternates`
 * inherits the parent's — so without a per-page canonical, every page would
 * declare `<link rel="canonical" href="/">` and look like a duplicate of the
 * homepage to search engines. Open Graph / Twitter titles don't inherit the
 * title template either, so we build the full-brand title here.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeegub.vercel.app';
export const SITE_NAME = 'IEEE SB GUB';
const BRAND_SUFFIX = `| ${SITE_NAME}`;
const DEFAULT_OG_IMAGE = '/images/hero.jpg';

/** Make an image reference absolute (schema.org / OG want absolute URLs). */
export function absoluteUrl(path: string): string {
  if (!path) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Strip HTML tags and collapse whitespace, then clamp to a meta-safe length. */
export function toPlainText(input: string | null | undefined, max = 160): string {
  if (!input) return '';
  const text = String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  // Clamp on a word boundary so we don't cut a word in half.
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Absolute path beginning with "/", e.g. "/Activities/Events". */
  path?: string;
  /** Relative or absolute image URL used for OG / Twitter cards. */
  image?: string;
  type?: 'website' | 'article';
};

/**
 * Build a complete Metadata object for a public page: the page title (the root
 * template appends the brand), description, a self-referencing canonical, and
 * matching Open Graph + Twitter cards.
 */
export function pageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}: PageMetaInput): Metadata {
  const ogTitle = `${title} ${BRAND_SUFFIX}`;
  const ogImage = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: ogImage, alt: title }],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}
