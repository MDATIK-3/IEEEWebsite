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
}) => {
  if (!show) return null;

  const groupLabels = {
    SB: "Student Branch",
    CS: "Computer Society",
    MAIN: "Main Chapter",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6 lg:hidden">
      <div className="relative w-full max-w-md rounded-t-3xl bg-white shadow-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 overflow-hidden">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full dark:bg-gray-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 pt-10 pb-6 space-y-8 max-h-[80vh] overflow-y-auto">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-gray-300">
            <Filter className="h-6 w-6 text-emerald-600" /> Filters
          </h2>

          <div>
            <label
              htmlFor="mobile-year-select"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Year
            </label>
            <select
              id="mobile-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Group
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(executiveData[selectedYear] || {}).map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedGroup === group
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-emerald-700 dark:hover:text-emerald-300'
                    }`}
                >
                  <Users className="h-4 w-4" />
                  {groupLabels[group] || group}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${selectedGroup === group
                      ? 'bg-white/30'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                  >
                    {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) +
                      (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-white font-medium shadow-md hover:bg-emerald-700 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
