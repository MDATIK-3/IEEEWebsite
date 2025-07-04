"use client";
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
    if (!show) return null;

    const groupLabels = {
        SB: "Student Branch",
        CS: "Computer Society",
        MAIN: "Main Chapter"
    };

    return (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-start justify-center p-4 pt-10 animate-fade-in lg:hidden">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md relative shadow-2xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Filter className="h-6 w-6 text-emerald-600" /> Filters
                </h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="mobile-year-select" className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
                        <select
                            id="mobile-year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Group</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(executiveData[selectedYear] || {}).map(group => (
                                <button
                                    key={group}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm ${selectedGroup === group ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200"}`}
                                >
                                    <Users className="h-3 w-3" />
                                    {groupLabels[group]}
                                    <span className={`text-xs px-1 py-0.5 rounded-full ${selectedGroup === group ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                        {(executiveData[selectedYear]?.[group]?.faculty?.length || 0) +
                                            (executiveData[selectedYear]?.[group]?.students?.length || 0)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mobile-sort-by" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            id="mobile-sort-by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        >
                            <option value="name">Name</option>
                            <option value="role">Role</option>
                            <option value="department">Department</option>
                            <option value="year">Year</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="mobile-filter-role" className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                        <select
                            id="mobile-filter-role"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
