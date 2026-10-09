/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { unstable_cache } from 'next/cache';
import { supabasePublic as sb } from './supabase/public';

/**
 * Server-side data access for public content.
 *
 * Fast loading: every base getter is wrapped in `unstable_cache`, so pages that
 * call them can be statically generated / ISR-cached and served from the edge.
 * Writes in the admin panel call `revalidateTag(TAGS.x)` to refresh instantly.
 *
 * Query optimization: one cached round-trip per entity; derived views (upcoming
 * / latest / by-id) are computed in memory from the cached list instead of
 * issuing extra queries. Row Level Security filters to published + scheduled
 * rows, so callers never need visibility predicates.
 */
export const TAGS = {
  events: 'events',
  executives: 'executives',
  achievements: 'achievements',
  collaborations: 'collaborations',
  faqs: 'faqs',
  moderatorMessages: 'moderator_messages',
  spotlights: 'spotlights',
  gallery: 'gallery_photos',
  membership: 'membership_info',
  contactInfo: 'contact_info',
  contributors: 'contributors',
  formOptions: 'form_options',
  announcements: 'announcements',
} as const;

const DAY = 86400;

const rows = async (table: string, build?: (q: any) => any) => {
  let q = sb.from(table).select('*');
  if (build) q = build(q);
  const { data, error } = await q;
  if (error) {
    console.error(`[queries] ${table}: ${error.message}`);
    return [];
  }
  return data ?? [];
};

// ---- Events -----------------------------------------------------------
export const getEvents = unstable_cache(
  () => rows('events', (q) => q.order('starts_at', { ascending: false, nullsFirst: false })),
  ['q:events'],
  { tags: [TAGS.events], revalidate: 300 }
);
export async function getEventById(id: string | number) {
  const all = await getEvents();
  return all.find((e: any) => String(e.id) === String(id)) ?? null;
}
export async function getLatestEvents(limit = 6) {
  return (await getEvents()).slice(0, limit);
}
export async function getUpcomingEvents(limit = 5) {
  const now = Date.now();
  return (await getEvents())
    .filter((e: any) => e.starts_at && new Date(e.starts_at).getTime() >= now)
    .sort((a: any, b: any) => +new Date(a.starts_at) - +new Date(b.starts_at))
    .slice(0, limit);
}

// ---- People / profiles ------------------------------------------------
export const getExecutives = unstable_cache(
  () => rows('executives', (q) => q.order('year', { ascending: false }).order('sort_order', { ascending: true })),
  ['q:executives'],
  { tags: [TAGS.executives], revalidate: DAY }
);

// ---- Simple content lists --------------------------------------------
export const getAchievements = unstable_cache(
  () => rows('achievements', (q) => q.order('year', { ascending: false, nullsFirst: false })),
  ['q:achievements'],
  { tags: [TAGS.achievements], revalidate: DAY }
);
export const getCollaborations = unstable_cache(
  () => rows('collaborations', (q) => q.order('id', { ascending: true })),
  ['q:collaborations'],
  { tags: [TAGS.collaborations], revalidate: DAY }
);
export const getFaqs = unstable_cache(
  (category = 'general') => rows('faqs', (q) => q.eq('category', category).order('sort_order', { ascending: true })),
  ['q:faqs'],
  { tags: [TAGS.faqs], revalidate: DAY }
);
export const getModeratorMessages = unstable_cache(
  () => rows('moderator_messages', (q) => q.order('sort_order', { ascending: true })),
  ['q:moderator_messages'],
  { tags: [TAGS.moderatorMessages], revalidate: DAY }
);
export const getSpotlights = unstable_cache(
  () => rows('spotlights', (q) => q.order('id', { ascending: true })),
  ['q:spotlights'],
  { tags: [TAGS.spotlights], revalidate: DAY }
);
export const getGalleryPhotos = unstable_cache(
  () => rows('gallery_photos', (q) => q.order('taken_on', { ascending: false, nullsFirst: false })),
  ['q:gallery_photos'],
  { tags: [TAGS.gallery], revalidate: DAY }
);
export const getContactInfo = unstable_cache(
  () => rows('contact_info', (q) => q.order('sort_order', { ascending: true })),
  ['q:contact_info'],
  { tags: [TAGS.contactInfo], revalidate: DAY }
);
export const getContributorsData = unstable_cache(
  () => rows('contributors', (q) => q.order('login', { ascending: true })),
  ['q:contributors'],
  { tags: [TAGS.contributors], revalidate: DAY }
);
export const getOrganizationTypes = unstable_cache(
  () => rows('organization_types', (q) => q.order('sort_order', { ascending: true })),
  ['q:organization_types'],
  { tags: [TAGS.formOptions], revalidate: DAY }
);
export const getPartnershipTypes = unstable_cache(
  () => rows('partnership_types', (q) => q.order('sort_order', { ascending: true })),
  ['q:partnership_types'],
  { tags: [TAGS.formOptions], revalidate: DAY }
);

// ---- Singleton --------------------------------------------------------
export const getMembership = unstable_cache(
  async () => {
    const { data } = await sb.from('membership_info').select('*').eq('id', 1).maybeSingle();
    return data ?? null;
  },
  ['q:membership_info'],
  { tags: [TAGS.membership], revalidate: DAY }
);

// ---- Announcements / news ticker -------------------------------------
export const getAnnouncements = unstable_cache(
  () => rows('announcements', (q) => q.order('priority', { ascending: false }).order('starts_at', { ascending: false })),
  ['q:announcements'],
  { tags: [TAGS.announcements], revalidate: 60 }
);

/**
 * Items for the news ticker: active announcements first, then upcoming events,
 * falling back to the latest events so the bar is never empty.
 */
export async function getTickerItems() {
  const [announcements, upcoming] = await Promise.all([getAnnouncements(), getUpcomingEvents(5)]);
  const items = [
    ...announcements.map((a: any) => ({
      kind: 'announcement' as const,
      title: a.title,
      href: a.link_url || null,
      variant: a.variant || 'info',
    })),
    ...upcoming.map((e: any) => ({
      kind: 'event' as const,
      title: e.title,
      href: `/Activities/Events/details/${e.id}`,
      variant: 'event' as const,
    })),
  ];
  if (items.length) return items;
  const latest = await getLatestEvents(5);
  return latest.map((e: any) => ({
    kind: 'event' as const,
    title: e.title,
    href: `/Activities/Events/details/${e.id}`,
    variant: 'event' as const,
  }));
}
