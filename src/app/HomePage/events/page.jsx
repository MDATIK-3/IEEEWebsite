"use client";
import Link from "next/link";

import EventsGrid from "@/app/components/Events/EventsGrid.jsx";
import events from "@/data/eventData.json";

const EventsPreview = () => {
  const now = new Date();

  const filteredEvents = events.filter((event) => {
    return event.eventName.toLowerCase().includes("".toLowerCase());
  });

  const displayedEvents = filteredEvents.slice(0, 6);

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12 group">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4 group-hover:from-emerald-700 group-hover:via-emerald-600 group-hover:to-teal-600 transition-all duration-500">
            Recent & Upcoming Events
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full group-hover:w-32 group-hover:h-1.5 group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-500"></div>
        </div>

        <p className="mt-6 text-green-700 group-hover:text-green-600 text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Discover our latest events and stay updated with upcoming activities
        </p>
      </div>

      {displayedEvents.length > 0 ? (
        <EventsGrid events={displayedEvents} now={now} />
      ) : (
        <div className="text-center py-16 group">
          <div className="w-24 h-24 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-200/50">
            <img
              src="/images/notfound.png"
              alt="No events"
              className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="text-2xl font-semibold text-green-800 group-hover:text-green-700 mb-2 transition-colors duration-300">
            No Events Available
          </h3>
          <p className="text-green-600 group-hover:text-green-500 mb-6 transition-colors duration-300">
            There are no events to display at the moment. Check back later!
          </p>
        </div>
      )}

      {filteredEvents.length > 6 && (
        <div className="flex justify-center mt-12">
          <Link href="/Events">
            <button className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-green-300/30 transform hover:scale-105 transition-all duration-500 overflow-hidden border border-transparent hover:border-green-400/20">
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center space-x-2">
                <span className="transition-colors duration-300">View All Events</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsPreview;