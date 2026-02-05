'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import EventsFilter from "@/app/components/Events/EventsFilter";
import EventsGrid from "@/app/components/Events/EventsGrid";
import events from "@/data/eventData.json";
import useMounted from "@/app/hooks/useMounted";
import { buildCalendarUrl, buildLocalDate } from "@/app/utils/eventCalendar";

const emptyStateVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const emptyStateItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.4, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, duration: 0.3, ease: "easeOut" },
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const formatMonth = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "Unknown Month";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const formatDay = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return { day: "--", weekday: "" };
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
};

const CalendarView = ({ events }) => {
  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (isNaN(aDate) && isNaN(bDate)) return 0;
      if (isNaN(aDate)) return 1;
      if (isNaN(bDate)) return -1;
      return bDate - aDate;
    });
    return sorted.reduce((acc, event) => {
      const key = formatMonth(event.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  if (!events.length) {
    return (
      <div className="flex items-center justify-center py-16 h-full min-h-[300px]">
        <p className="text-gray-500 text-lg">No events to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([month, monthEvents]) => (
        <section key={month} className="space-y-4">
          <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">{month}</h3>
          <div className="space-y-4">
            {monthEvents.map((event) => {
              const dateInfo = formatDay(event.date);
              const calendarUrl = buildCalendarUrl(event);
              const startDate = buildLocalDate(event.date, event.startTime);
              const isUpcoming = startDate ? startDate > new Date() : false;
              return (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-emerald-100 bg-white/90 dark:bg-slate-800/90 dark:border-emerald-800 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 flex flex-col items-center justify-center">
                      <span className="text-sm font-semibold">{dateInfo.weekday}</span>
                      <span className="text-lg font-bold">{dateInfo.day}</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.eventName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {event.eventType} • {event.time || "Time TBA"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.locationLabel || event.eventArea || "Location TBA"}
                      </p>
                    </div>
                  </div>
                  <div className="md:ml-auto flex flex-wrap items-center gap-3">
                    <Link
                      href={`/Activities/Events/details/${event.id}`}
                      className="inline-flex items-center rounded-full border border-emerald-300 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
                    >
                      View Details
                    </Link>
                    {calendarUrl && isUpcoming && (
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Add to Calendar
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

const EventsFullPage = () => {
  const now = new Date();

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  
  const mounted = useMounted();

  if (!mounted) return <div className="min-h-screen"></div>;

  const filteredEvents = events.filter((event) => {
    const lowerSearch = searchText.toLowerCase();

    const eventNameMatch = event.eventName?.toLowerCase().includes(lowerSearch);
    const organizerMatch = event.organizer?.toLowerCase().includes(lowerSearch);
    const yearMatch = new Date(event.date).getFullYear().toString().includes(lowerSearch);

    const matchesSearch =
      !searchText || eventNameMatch || organizerMatch || yearMatch;

    if (filterType === "upcoming") {
      return new Date(event.date) > now && matchesSearch;
    } else if (filterType === "past") {
      return new Date(event.date) < now && matchesSearch;
    }

    return matchesSearch;
  });

  const displayedEvents = filteredEvents.slice(0, 9);
  const calendarEvents = filteredEvents;
  const upcomingCount = events.filter((event) => new Date(event.date) > now).length;
  const pastCount = events.filter((event) => new Date(event.date) < now).length;

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto border-t border-green-200">
      <EventsFilter
        searchText={searchText}
        setSearchText={setSearchText}
        filterType={filterType}
        setFilterType={setFilterType}
        counts={{ all: events.length, upcoming: upcomingCount, past: pastCount }}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />

      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 dark:bg-slate-800 dark:border-emerald-700 p-1 shadow-sm">
          {[
            { id: "list", label: "List View" },
            { id: "calendar", label: "Calendar View" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setViewMode(option.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                viewMode === option.id
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {((viewMode === "list" && displayedEvents.length > 0) ||
        (viewMode === "calendar" && calendarEvents.length > 0)) ? (
        viewMode === "list" ? (
          <EventsGrid events={displayedEvents} now={now} />
        ) : (
          <CalendarView events={calendarEvents} />
        )
      ) : (
        <motion.div
          key="empty-state"
          className="text-center py-16"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            variants={iconVariants}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h3
            className="text-2xl font-semibold text-emerald-800 mb-2"
            variants={emptyStateItemVariants}
          >
            {searchText ? "No Events Found" : "No Events Available"}
          </motion.h3>

          <motion.p
            className="text-emerald-600 mb-6 max-w-md mx-auto"
            variants={emptyStateItemVariants}
          >
            {searchText
              ? `No events match your search for "${searchText}". Try different keywords or browse all events.`
              : "There are no events to display at the moment. Check back later for exciting updates!"}
          </motion.p>

          <AnimatePresence>
            {searchText && (
              <motion.button
                onClick={() => setSearchText("")}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                whileTap="tap"
                aria-label="Clear search"
              >
                <span className="flex items-center space-x-2 justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Clear Search</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EventsFullPage;
