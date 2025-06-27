'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EVECA from "./EVECA";

const AllEvent = () => {
  const pathname = usePathname();
  const isFullPage = pathname === "/events";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/event.json");
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sorted);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    if (filterType === "upcoming") {
      return new Date(event.date) > now && matchesSearch;
    } else if (filterType === "past") {
      return new Date(event.date) < now && matchesSearch;
    }
    return matchesSearch;
  });

  const displayedEvents = isFullPage ? filteredEvents : filteredEvents.slice(0, 6);
  const upcomingCount = events.filter(event => new Date(event.date) > now).length;
  const pastCount = events.filter(event => new Date(event.date) < now).length;

  const clearSearch = () => {
    setSearchText("");
  };

  if (loading) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-green-700 text-lg font-medium animate-pulse">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Events</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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

      {(isFullPage) && (
        <div className="mb-12 space-y-8">
          <div className="max-w-2xl mx-auto">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-green-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                aria-label="Search events"
              />
              {searchText && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-500 hover:text-green-700 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-2 shadow-lg">
              <div className="flex space-x-1">
                {[
                  { key: "all", label: "All Events", count: events.length },
                  { key: "upcoming", label: "Upcoming", count: upcomingCount },
                  { key: "past", label: "Past Events", count: pastCount }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-transform duration-300 transform ${filterType === filter.key
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/40 scale-110"
                      : "text-green-700 hover:bg-green-200 hover:scale-105 hover:brightness-105"
                      }`}
                    aria-pressed={filterType === filter.key}
                  >
                    <span className="relative z-10">
                      {filter.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterType === filter.key
                        ? "bg-green-500 text-white"
                        : "bg-green-200 text-green-800"
                        }`}>
                        {filter.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {searchText && (
            <div className="text-center">
              <p className="text-green-700 bg-green-50 border border-green-200 rounded-full px-6 py-2 inline-flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching &quot;{searchText}&quot;</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Events Grid */}
      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents.map((event, index) => (
            <div
              key={event.id}
              className="transform transition-shadow duration-300 hover:scale-110 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EVECA event={event} now={now} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-green-800 mb-2">
            {searchText ? "No Events Found" : "No Events Available"}
          </h3>
          <p className="text-green-600 mb-6">
            {searchText
              ? `No events match your search for "${searchText}". Try different keywords.`
              : "There are no events to display at the moment. Check back later!"
            }
          </p>
          {searchText && (
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {!isFullPage && filteredEvents.length > 6 && (
        <div className="flex justify-center mt-12">
          <Link href="/events">
            <button className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-2">
                <span>View All Events</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AllEvent;