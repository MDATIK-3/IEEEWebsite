import EventsPageClient from "./EventsPageClient";
import { getEventCards } from "@/lib/queries";
import { toEventViews } from "@/app/utils/eventView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Upcoming and past events, workshops, seminars and competitions hosted by the IEEE Student Branch at Green University of Bangladesh (IEEE GUB).",
  path: "/Activities/Events",
});

// Match the cached getter's revalidate window; admin writes call
// revalidateTag(TAGS.events) to refresh this page instantly.
export const revalidate = 300;

const EventsFullPage = async () => {
  // Cards only — the heavy detail fields aren't rendered here, so use the
  // projected getter to keep the page's data (and hydration payload) small.
  const events = toEventViews(await getEventCards());
  return <EventsPageClient events={events} />;
};

export default EventsFullPage;
