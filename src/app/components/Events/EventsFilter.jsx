const EventsFilter = ({
  searchText,
  setSearchText,
  filterType,
  setFilterType,
  counts,
  isSearchFocused,
  setIsSearchFocused,
}) => {
  const clearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="mb-12 space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className={`relative transition-all duration-300 ${isSearchFocused ? "transform scale-105" : ""}`}>
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
        <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex space-x-9">
            {[
              { key: "all", label: "All Events", count: counts.all },
              { key: "upcoming", label: "Upcoming", count: counts.upcoming },
              { key: "past", label: "Past Events", count: counts.past },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`relative px-3 py-3 rounded-xl  text-sm font-semibold transition-transform duration-300 transform ${
                  filterType === filter.key
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/40 scale-110"
                    : "text-green-700 hover:bg-green-200 hover:scale-105 hover:brightness-105"
                }`}
                aria-pressed={filterType === filter.key}
              >
                <span className="relative z-10">
                  {filter.label}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filterType === filter.key ? "bg-green-500 text-white" : "bg-green-200 text-green-800"
                    }`}
                  >
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
            <span>
              Found {filterType === "all" ? counts.all : filterType === "upcoming" ? counts.upcoming : counts.past} event
              {filterType === "all"
                ? counts.all !== 1
                : filterType === "upcoming"
                ? counts.upcoming !== 1
                : counts.past !== 1
                ? "s"
                : ""}
              {" "}matching "{searchText}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsFilter;
