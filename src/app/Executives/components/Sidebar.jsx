'use client';
import { useTheme } from '@/app/Theme/ThemeProvider';
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
    setFilterRole
}) => {
    const { isDark } = useTheme();

    const groupLabels = {
        SB: "Student Branch",
        CS: "Computer Society",
        PES: "Power & Energy Society"
    };

    return (
        <aside className={`${isDark ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-800'} w-1/5 border-r p-6 sticky top-14 h-screen overflow-y-auto hidden lg:block shadow-lg`}>
            <div className="mb-8">
                <h2 className={`${isDark ? 'text-gray-300' : 'text-gray-800'} text-2xl font-bold mb-6 flex items-center gap-2`}>
                    <Filter className="h-6 w-6 text-emerald-600" /> Filters
                </h2>
                <div className="mb-6">
                    <label htmlFor="year-select" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Select Year</label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    >
                        {years.map(year => (
                            <option key={year} value={year} className={`${isDark ? 'bg-gray-800 text-gray-300' : ''}`}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Select Group</label>
                    <div className="flex flex-col gap-2">
                        {Object.keys(executiveData[selectedYear] || {}).map(group => (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm ${selectedGroup === group ? "bg-emerald-600 text-white shadow-md transform scale-[1.02]" : isDark ? "bg-gray-700 text-gray-300 hover:bg-emerald-700 hover:text-emerald-300 border border-gray-600" : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200"}`}
                            >
                                <Users className="h-4 w-4" />
                                <span>{groupLabels[group] || group}</span>
                                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${selectedGroup === group ? 'bg-white/20' : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                                    {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) + (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="sort-by" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Sort By</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    >
                        <option value="name">Name</option>
                        <option value="role">Role</option>
                        <option value="department">Department</option>
                        <option value="year">Year</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-role" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Filter by Role</label>
                    <select
                        id="filter-role"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                    >
                        <option value="all">All Members</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Students</option>
                        <option value="president">Presidents</option>
                        <option value="officer">Officers</option>
                    </select>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
