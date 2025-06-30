'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import EventsFilter from "./EventsFilter";
import EventsGrid from "./EventsGrid";
import LoadingSpinner from "../LoadingSpinner";
import ErrorDisplay from "../../Executives/components/ErrorDisplay";
import { useEvent } from '@/app/context/EventContext';

const EventsContainer = ({ isFullPage }) => {
  const { events, loading, error } = useEvent();
  const [now, setNow] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchText.toLowerCase());

    if (filterType === "upcoming") {
      return new Date(event.date) > now && matchesSearch;
    } else if (filterType === "past") {
      return new Date(event.date) < now && matchesSearch;
    }
    return matchesSearch;
  });

  const displayedEvents = isFullPage ? filteredEvents.slice(0, 9) : filteredEvents.slice(0, 6);
  const upcomingCount = events.filter((event) => new Date(event.date) > now).length;
  const pastCount = events.filter((event) => new Date(event.date) < now).length;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto border-t border-green-200">
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
            {isFullPage ? "All Events" : "Recent & Upcoming Events"}
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
        </div>

        {!isFullPage && (
          <p className="mt-6 text-green-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our latest events and stay updated with upcoming activities
          </p>
        )}
      </div>

      {isFullPage && (
        <EventsFilter
          searchText={searchText}
          setSearchText={setSearchText}
          filterType={filterType}
          setFilterType={setFilterType}
          counts={{ all: events.length, upcoming: upcomingCount, past: pastCount }}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
        />
      )}

      {displayedEvents.length > 0 ? (
        <EventsGrid events={displayedEvents} now={now} />
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <img
              src="/images/notfound.png"
              alt="No events"
              className="w-12 h-12"
            />
          </div>
          <h3 className="text-2xl font-semibold text-green-800 mb-2">
            {searchText ? "No Events Found" : "No Events Available"}
          </h3>
          <p className="text-green-600 mb-6">
            {searchText
              ? "No events match your search for \"" + searchText + "\". Try different keywords."
              : "There are no events to display at the moment. Check back later!"}
          </p>
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {!isFullPage && filteredEvents.length > 6 && (
        <div className="flex justify-center mt-12">
          <Link href="/Events">
            <button className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-2">
                <span>View All Events</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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

      {isFullPage && events.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm border border-green-200 rounded-2xl shadow-xl p-4 z-10">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">{displayedEvents.length} shown</span>
            </div>
            <div className="w-px h-4 bg-green-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-green-700 font-medium">{events.length} total</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsContainer;
