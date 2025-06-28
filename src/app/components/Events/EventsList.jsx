'use client';
import { useState } from 'react';
import Link from 'next/link';
import EVECA from '../../HomePage/events/EVECA';

const EventsList = ({ events, isFullPage }) => {
  const [now] = useState(new Date());
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const clearSearch = () => setSearchText('');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchText.toLowerCase());
    const eventDate = new Date(event.date);

    if (filterType === 'upcoming') return eventDate > now && matchesSearch;
    if (filterType === 'past') return eventDate < now && matchesSearch;
    return matchesSearch;
  });

  const displayedEvents = isFullPage ? filteredEvents : filteredEvents.slice(0, 6);
  const upcomingCount = events.filter(e => new Date(e.date) > now).length;
  const pastCount = events.filter(e => new Date(e.date) < now).length;

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto border-t border-green-200">
      {/* Heading */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
            {isFullPage ? 'All Events' : 'Recent & Upcoming Events'}
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
        </div>
        {!isFullPage && (
          <p className="mt-6 text-green-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our latest events and stay updated with upcoming activities
          </p>
        )}
      </div>

      {/* Search and Filters */}
      {isFullPage && (
        <div className="mb-12 space-y-8">
          {/* Search */}
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
                onChange={e => setSearchText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-green-200 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
              />
              {searchText && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-500 hover:text-green-700"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center">
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-2 shadow-lg">
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: 'All Events', count: events.length },
                  { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
                  { key: 'past', label: 'Past Events', count: pastCount },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(key)}
                    className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-transform duration-300 transform ${
                      filterType === key
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/40 scale-110'
                        : 'text-green-700 hover:bg-green-200 hover:scale-105 hover:brightness-105'
                    }`}
                  >
                    <span className="relative z-10">
                      {label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        filterType === key
                          ? 'bg-green-500 text-white'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Cards */}
      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents.map((event, i) => (
            <div
              key={event.id}
              className="transform transition-shadow duration-300 hover:scale-110 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
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
            {searchText ? 'No Events Found' : 'No Events Available'}
          </h3>
          <p className="text-green-600 mb-6">
            {searchText
              ? `No events match your search for "${searchText}". Try different keywords.`
              : 'There are no events to display at the moment. Check back later!'}
          </p>
        </div>
      )}

      {/* View All Button */}
      {!isFullPage && filteredEvents.length > 6 && (
        <div className="flex justify-center mt-12">
          <Link href="/events">
            <button className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventsList;
