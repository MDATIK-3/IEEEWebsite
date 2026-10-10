import { getEventById, getEventCards } from '@/lib/queries';
import { toEventView } from '@/app/utils/eventView';
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

const NotFound = () => (
  <main className="text-center py-20 text-gray-700 dark:text-gray-300">
    <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
    <p>Please check the link or try searching for other events.</p>
  </main>
);

const EventDetailsPage = async ({ params }) => {
  const { id } = await params;
  const event = toEventView(await getEventById(id));

  if (!event) return <NotFound />;

  return <EventDetailsClient event={event} />;
};

export default EventDetailsPage;
