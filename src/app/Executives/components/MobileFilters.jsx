'use client';
import { useTheme } from '@/app/Theme/ThemeProvider';
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
    setFilterRole
}) => {
    const { isDark } = useTheme();

    if (!show) return null;

    const groupLabels = {
        SB: "Student Branch",
        CS: "Computer Society",
        MAIN: "Main Chapter"
    };

    return (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-start justify-center p-4 pt-10 animate-fade-in lg:hidden">
            <div className={`${isDark ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-800'} rounded-2xl border p-6 w-full max-w-md relative shadow-2xl animate-scale-in`}>
                <button
                    onClick={onClose}
                    className={`${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'} absolute top-4 right-4 p-2 rounded-full transition-colors`}
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className={`${isDark ? 'text-gray-300' : 'text-gray-800'} text-2xl font-bold mb-6 flex items-center gap-2`}>
                    <Filter className="h-6 w-6 text-emerald-600" /> Filters
                </h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="mobile-year-select" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Select Year</label>
                        <select
                            id="mobile-year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                        >
                            {years.map(year => (
                                <option key={year} value={year} className={`${isDark ? 'bg-gray-800 text-gray-300' : ''}`}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Select Group</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(executiveData[selectedYear] || {}).map(group => (
                                <button
                                    key={group}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm ${selectedGroup === group ? "bg-emerald-600 text-white shadow-md" : isDark ? "bg-gray-700 text-gray-300 hover:bg-emerald-700 hover:text-emerald-300 border border-gray-600" : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200"}`}
                                >
                                    <Users className="h-3 w-3" />
                                    {groupLabels[group]}
                                    <span className={`text-xs px-1 py-0.5 rounded-full ${selectedGroup === group ? 'bg-white/20' : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                                        {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) +
                                            (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mobile-sort-by" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Sort By</label>
                        <select
                            id="mobile-sort-by"
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
                        <label htmlFor="mobile-filter-role" className={`${isDark ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium mb-2`}>Filter by Role</label>
                        <select
                            id="mobile-filter-role"
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
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileFilters;
