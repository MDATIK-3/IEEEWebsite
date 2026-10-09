'use client';
import { Filter, Users } from "lucide-react";

const Sidebar = ({
  years,
  selectedYear,
  setSelectedYear,
  executiveData,
  selectedGroup,
  setSelectedGroup,
}) => {
  const groupLabels = {
    SB: "Student Branch",
    CS: "Computer Society",
    PES: "Power & Energy Society",
  };

  return (
    <aside className="sticky top-22 hidden h-[calc(100vh-6rem)] w-[280px] overflow-y-auto rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/80 dark:text-gray-200 lg:block">
      <div className="mb-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-200">
          <Filter className="h-6 w-6 text-emerald-600" /> Filters
        </h2>

        <div className="mb-6">
          <label
            htmlFor="year-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-gray-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all dark:border-emerald-800 dark:bg-slate-800 dark:text-gray-200"
          >
            {years.map((year) => (
              <option key={year} value={year} className="dark:bg-slate-800 dark:text-gray-200">
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Group
          </label>
          <div className="flex flex-col gap-2">
            {Object.keys(executiveData[selectedYear] || {}).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 text-left
                  ${selectedGroup === group
                    ? "bg-emerald-600 shadow-md text-white"
                    : "border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
                  }
                `}
              >
                <Users className="h-4 w-4" />
                <span>{groupLabels[group] || group}</span>
                <span
                  className={`ml-auto rounded-full px-2 py-1 text-xs
                    ${selectedGroup === group
                      ? "bg-white/20"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                    }
                  `}
                >
                  {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) +
                    (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
