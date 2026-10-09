import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeegub.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /HomePage and /components are accidental routes (component files named
      // page.jsx) — keep them out of the index until they're renamed.
      disallow: ['/admin', '/api', '/HomePage', '/components'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
