'use client';
import { X, Filter, Users } from "lucide-react";

const MobileFilters = ({
  show,
  onClose,
  years,
  selectedYear,
  setSelectedYear,
  executiveData,
  selectedGroup,
  setSelectedGroup,
  sortBy,
  setSortBy,
  filterRole,
  setFilterRole,
}) => {
  if (!show) return null;

  const groupLabels = {
    SB: "Student Branch",
    CS: "Computer Society",
    MAIN: "Main Chapter",
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-start justify-center p-4 pt-10 animate-fade-in lg:hidden">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-scale-in dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-300">
          <Filter className="h-6 w-6 text-emerald-600" /> Filters
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="mobile-year-select"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Year
            </label>
            <select
              id="mobile-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Group
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(executiveData[selectedYear] || {}).map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedGroup === group
                      ? 'bg-emerald-600 shadow-md text-white'
                      : 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  <Users className="h-3 w-3" />
                  {groupLabels[group]}
                  <span
                    className={`ml-1 rounded-full px-1 py-0.5 text-xs ${
                      selectedGroup === group
                        ? 'bg-white/20'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) +
                      (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="mobile-sort-by"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sort By
            </label>
            <select
              id="mobile-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="name">Name</option>
              <option value="role">Role</option>
              <option value="department">Department</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="mobile-filter-role"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Filter by Role
            </label>
            <select
              id="mobile-filter-role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">All Members</option>
              <option value="faculty">Faculty</option>
              <option value="student">Students</option>
              <option value="president">Presidents</option>
              <option value="officer">Officers</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-white shadow-md transition-colors hover:bg-emerald-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
