import events from "@/data/eventData.json";
import EventsPageClient from "./EventsPageClient";

const EventsFullPage = () => {
  return <EventsPageClient events={events} />;
};

export default EventsFullPage;
