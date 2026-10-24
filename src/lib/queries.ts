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

// Column projection, PostgREST's answer to `.only()` / `select_related`'s field
// list: pass an explicit column string so a query returns only what the caller
// renders. Defaults to '*' so unprojected getters are unchanged. (There are no
// foreign-table joins to make here — related content like event speakers/
// gallery is stored inline as jsonb/array columns, not in child tables.)
const rows = async (table: string, build?: (q: any) => any, columns = '*'): Promise<any[]> => {
  // `q` is held as `any`: a non-literal column string defeats supabase-js's
  // result-type inference (it would widen to GenericStringError[]), and this
  // layer is intentionally untyped — callers adapt the rows at their boundary.
  let q: any = sb.from(table).select(columns);
  if (build) q = build(q);
  const { data, error } = await q;
  if (error) {
    console.error(`[queries] ${table}: ${error.message}`);
    return [];
  }
  return (data as any[]) ?? [];
};

// ---- Events -----------------------------------------------------------
// Columns a card / listing / calendar view actually renders. The detail-only
// payload — speakers/resources/highlights (jsonb) + gallery (text[]) + the two
// bios + registration_link — is deliberately excluded so list pages don't fetch
// (and then serialize into every visitor's hydration payload) a blob per event
// they never show. `timezone` is kept so dates/times format in the event's own
// zone; `description` feeds the "Add to calendar" link; `organizer` the search.
const EVENT_CARD_COLS =
  'id, title, image_url, description, starts_at, ends_at, guest, location_label, event_area, event_type, timezone, organizer';

/**
 * Lightweight events list (projected to EVENT_CARD_COLS) for every card-style
 * consumer: the listing page, homepage preview, latest/upcoming, the sitemap
 * and generateStaticParams. Avoids shipping the heavy detail fields to the edge.
 */
export const getEventCards = unstable_cache(
  () =>
    rows('events', (q) => q.order('starts_at', { ascending: false, nullsFirst: false }), EVENT_CARD_COLS),
  ['q:event_cards'],
  { tags: [TAGS.events], revalidate: 300 }
);

/**
 * Full events rows (all columns). Only the two consumers that render the heavy
 * fields use this: the chatbot knowledge base and the event detail page (via
 * getEventById). Everything card-shaped uses `getEventCards`.
 */
export const getEvents = unstable_cache(
  () => rows('events', (q) => q.order('starts_at', { ascending: false, nullsFirst: false })),
  ['q:events'],
  { tags: [TAGS.events], revalidate: 300 }
);
export async function getEventById(id: string | number) {
  // Detail needs the full row; reuse the full cached list (also kept warm by the
  // chatbot) instead of issuing a second query.
  const all = await getEvents();
  return all.find((e: any) => String(e.id) === String(id)) ?? null;
}
export async function getLatestEvents(limit = 6) {
  return (await getEventCards()).slice(0, limit);
}
export async function getUpcomingEvents(limit = 5) {
  const now = Date.now();
  return (await getEventCards())
    .filter((e: any) => e.starts_at && new Date(e.starts_at).getTime() >= now)
    .sort((a: any, b: any) => +new Date(a.starts_at) - +new Date(b.starts_at))
    .slice(0, limit);
}

// ---- People / profiles ------------------------------------------------
export const getExecutives = unstable_cache(
  () =>
    rows(
      'executives',
      (q) => q.order('year', { ascending: false }).order('sort_order', { ascending: true }),
      // Only the fields groupExecutives() reshapes into the UI; is_published
      // (an RLS predicate) + created_at/updated_at are never read client-side.
      'id, year, committee, member_group, name, role, img, facebook, linkedin, email, sort_order'
    ),
  ['q:executives'],
  { tags: [TAGS.executives], revalidate: DAY }
);

// ---- Simple content lists --------------------------------------------
export const getAchievements = unstable_cache(
  () =>
    rows('achievements', (q) =>
      q
        .order('sort_order', { ascending: true })
        .order('year', { ascending: false, nullsFirst: false })
    ),
  ['q:achievements'],
  { tags: [TAGS.achievements], revalidate: DAY }
);
export const getCollaborations = unstable_cache(
  () =>
    rows('collaborations', (q) =>
      q.order('sort_order', { ascending: true }).order('id', { ascending: true })
    ),
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
  () =>
    rows(
      'announcements',
      (q) => q.order('priority', { ascending: false }).order('starts_at', { ascending: false }),
      // Only what toTickerItem() reads (ordering columns needn't be selected).
      'title, link_url, variant, ends_at'
    ),
  ['q:announcements'],
  // This feeds the news ticker in the ROOT layout, so its revalidate window is
  // inherited by every static page. A short window forced the whole site to
  // regenerate that often. Freshness is handled elsewhere — writes call
  // revalidateTag(announcements), and the ticker live-polls /api/announcements/
  // ticker (uncached) for schedule changes — so this only needs a long,
  // best-effort window for the initial SSR seed.
  { tags: [TAGS.announcements], revalidate: 600 }
);

export interface TickerItem {
  title: string;
  href: string | null;
  variant: string;
  endsAt: string | null;
}

function toTickerItem(a: any): TickerItem {
  return {
    title: a.title,
    href: a.link_url || null,
    variant: a.variant || 'info',
    endsAt: a.ends_at ?? null,
  };
}

export async function getTickerItems(): Promise<TickerItem[]> {
  const announcements = await getAnnouncements();
  return announcements.map(toTickerItem);
}


export async function getTickerItemsLive(): Promise<TickerItem[]> {
  const { data, error } = await sb
    .from('announcements')
    .select('title, link_url, variant, ends_at')
    .order('priority', { ascending: false })
    .order('starts_at', { ascending: false });
  if (error) {
    console.error(`[queries] announcements(live): ${error.message}`);
    return [];
  }
  return (data ?? []).map(toTickerItem);
}
