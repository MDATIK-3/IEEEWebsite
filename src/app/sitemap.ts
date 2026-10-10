import type { MetadataRoute } from 'next';
import { getEventCards } from '@/lib/queries';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeegub.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/Activities/Events',
    '/Activities/Achievements',
    '/Executives',
    '/Gallery',
    '/Join',
    '/LearnIEEE',
    '/Collaboration',
    '/contact/GeneralContact',
    '/contact/partnership',
    '/contact/developer',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const events = (await getEventCards()) as Array<{ id: number | string }>;
  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${base}/Activities/Events/details/${e.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}
