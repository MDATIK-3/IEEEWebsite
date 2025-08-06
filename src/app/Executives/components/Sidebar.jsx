'use client';
import { Filter, Users } from "lucide-react";

const Sidebar = ({
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
  const groupLabels = {
    SB: "Student Branch",
    CS: "Computer Society",
    PES: "Power & Energy Society",
  };

  return (
    <aside className="sticky top-14 hidden h-screen w-1/5 overflow-y-auto border-r border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 lg:block">
      <div className="mb-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-300">
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {years.map((year) => (
              <option key={year} value={year} className="dark:bg-gray-800 dark:text-gray-300">
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
                className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 text-left
                  ${
                    selectedGroup === group
                      ? "bg-emerald-600 shadow-md text-white transform scale-[1.02]"
                      : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-emerald-700 dark:hover:text-emerald-300"
                  }
                `}
              >
                <Users className="h-4 w-4" />
                <span>{groupLabels[group] || group}</span>
                <span
                  className={`ml-auto rounded-full px-2 py-1 text-xs
                    ${
                      selectedGroup === group
                        ? "bg-white/20"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
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

        <div className="mb-6">
          <label
            htmlFor="sort-by"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Sort By
          </label>
          <select
            id="sort-by"
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
            htmlFor="filter-role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter by Role
          </label>
          <select
            id="filter-role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">All Members</option>
            <option value="faculty">Faculty</option>
            <option value="student">Students</option>
            <option value="president">Chair</option>
            
          </select>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
