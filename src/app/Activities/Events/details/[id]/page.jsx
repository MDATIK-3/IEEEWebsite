import { notFound } from 'next/navigation';
import { getEventById, getEventCards } from '@/lib/queries';
import { toEventView } from '@/app/utils/eventView';
import { pageMetadata, absoluteUrl, toPlainText, SITE_URL, SITE_NAME } from '@/lib/seo';
import EventDetailsClient from './EventDetailsClient';

// Match the cached getter's revalidate window; admin writes call
// revalidateTag(TAGS.events) to refresh this page instantly.
export const revalidate = 300;

// Pre-render a detail page for each known event at build time. Only ids are
// needed here, so use the projected card getter rather than the full rows.
export async function generateStaticParams() {
  const events = await getEventCards();
  return events.map((e) => ({ id: String(e.id) }));
}

// Per-event SEO: unique title, a plain-text description derived from the event
// body, and an Open Graph image using the event's own poster. Missing events
// are marked noindex so a stray URL never gets indexed as a thin page.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = toEventView(await getEventById(id));

  if (!event) {
    return { title: 'Event Not Found', robots: { index: false, follow: true } };
  }

  const description =
    toPlainText(event.description) ||
    `${event.eventName} — an event hosted by ${SITE_NAME} at Green University of Bangladesh.`;

  return pageMetadata({
    title: event.eventName,
    description,
    path: `/Activities/Events/details/${id}`,
    image: event.image || '/images/hero.jpg',
    type: 'article',
  });
}

const EventDetailsPage = async ({ params }) => {
  const { id } = await params;
  const row = await getEventById(id);
  if (!row) notFound();

  const event = toEventView(row);

  // schema.org/Event rich-result markup. Dates come from the raw row (ISO
  // timestamps); the view-model only carries display strings.
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.eventName,
    ...(row.starts_at ? { startDate: row.starts_at } : {}),
    ...(row.ends_at ? { endDate: row.ends_at } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: toPlainText(event.description, 500) || event.eventName,
    ...(event.image ? { image: [absoluteUrl(event.image)] } : {}),
    url: `${SITE_URL}/Activities/Events/details/${id}`,
    location: {
      '@type': 'Place',
      name: event.locationLabel || event.eventArea || 'Green University of Bangladesh',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'IEEE Student Branch, Green University of Bangladesh',
      url: SITE_URL,
    },
    ...(event.registrationLink
      ? {
          offers: {
            '@type': 'Offer',
            url: event.registrationLink,
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'BDT',
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${SITE_URL}/Activities/Events` },
      {
        '@type': 'ListItem',
        position: 3,
        name: event.eventName,
        item: `${SITE_URL}/Activities/Events/details/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <EventDetailsClient event={event} />
    </>
  );
};

export default EventDetailsPage;
