'use client'

import { useState, useRef, useEffect } from "react";
import { useTheme } from '@/app/Theme/ThemeProvider';

const EventsFilter = ({
  searchText,
  setSearchText,
  filterType,
  setFilterType,
  counts,
  setIsSearchFocused,
}) => {
  const { isDark } = useTheme();
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const clearSearch = () => setSearchText("");

  const filters = [
    { key: "all", label: "All", count: counts.all },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "past", label: "Past", count: counts.past },
  ];

  const getSearchClasses = () =>
    searchText
      ? isDark
        ? "scale-102 shadow-lg ring-emerald-700 ring-1"
        : "scale-102 shadow-lg ring-emerald-300 ring-1"
      : isSearchHovered
      ? "scale-101 shadow-md"
      : "scale-100 shadow-sm";

  return (
    <div className={`max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
      <div className="text-center mt-4 mb-5">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 inline-block advanced-animated-gradient"
        >
          All Events
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className={`relative flex-grow transition-transform duration-300 ${getSearchClasses()} rounded-2xl ${isDark ? 'bg-gray-800 bg-opacity-80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-sm'}`}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg
              className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search events..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-12 pr-12 py-3 md:py-4 border rounded-2xl bg-transparent text-sm md:text-base transition-all duration-300 outline-none ${isDark ? 'border-emerald-700 placeholder-emerald-400 text-gray-300' : 'border-emerald-100 placeholder-gray-500 text-gray-800'}`}
            aria-label="Search events"
          />

          {searchText && (
            <button
              onClick={clearSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center z-20 transition-transform hover:scale-110 ${isDark ? 'text-emerald-400 hover:text-emerald-600' : 'text-emerald-500 hover:text-emerald-700'}`}
              aria-label="Clear search"
              type="button"
            >
              <svg
                className="h-4 w-4 md:h-5 md:w-5 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`flex items-center px-5 py-3 rounded-2xl border font-semibold shadow-sm transition-colors ${isDark ? 'border-emerald-600 bg-gray-800 text-emerald-400 hover:bg-gray-700' : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'}`}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Select event filter"
          >
            <span>{filters.find((f) => f.key === filterType)?.label || "Filter"}</span>
            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul
              className={`absolute right-0 z-50 mt-2 w-48 rounded-2xl shadow-lg max-h-60 overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}
              role="listbox"
              aria-label="Event filters"
              tabIndex={-1}
            >
              {filters.map((filter) => (
                <li
                  key={filter.key}
                  role="option"
                  aria-selected={filterType === filter.key}
                  onClick={() => {
                    setFilterType(filter.key);
                    setIsDropdownOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFilterType(filter.key);
                      setIsDropdownOpen(false);
                    }
                  }}
                  tabIndex={0}
                  className={`cursor-pointer select-none relative py-2 px-5 text-sm flex justify-between items-center ${filterType === filter.key
                      ? isDark
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-emerald-600 text-white font-semibold"
                      : isDark
                      ? "text-gray-300 hover:bg-emerald-900"
                      : "text-gray-900 hover:bg-emerald-100"
                    }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${filterType === filter.key
                        ? "bg-white/30 text-white"
                        : "bg-emerald-100 text-emerald-800"
                      }`}
                  >
                    {filter.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsFilter;
