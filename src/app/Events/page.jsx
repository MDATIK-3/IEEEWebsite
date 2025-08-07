'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import EventsFilter from "../components/Events/EventsFilter";
import EventsGrid from "../components/Events/EventsGrid";
import events from "@/data/eventData.json";
import useMounted from "../hooks/useMounted";

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

const EventsFullPage = () => {
  const now = new Date();

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const mounted = useMounted();

  if (!mounted) return <div className="min-h-screen"></div>;

  // --- Enhanced Search Logic ---
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

      {displayedEvents.length > 0 ? (
        <EventsGrid events={displayedEvents} now={now} />
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
