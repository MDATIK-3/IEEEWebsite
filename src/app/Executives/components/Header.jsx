'use client';

import { Award, Search, Filter } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm, onMobileFilterClick }) => {
    return (
        <div className="mb-8 pb-8 rounded-2xl shadow-lg
      bg-white border border-gray-200 text-gray-900
      dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        >
            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border
            bg-green-50 border-green-100 text-green-700
            dark:bg-green-900 dark:border-green-700 dark:text-green-400"
                    >
                        <Award className="h-5 w-5" />
                        <span className="font-semibold">IEEE Green University</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight
            text-gray-900 dark:text-gray-300"
                    >
                        Meet Our Visionary <br />
                        <span className="text-green-600 dark:text-green-400">IEEE Executives</span>
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto leading-relaxed
            text-gray-600 dark:text-gray-400"
                    >
                        Explore the dedicated individuals driving innovation and excellence in technology.
                    </p>
                </div>

                <div className="flex flex-col gap-4 items-center justify-center max-w-4xl mx-auto">
                    {/* Filter Button - Mobile Only */}
                    <button
                        onClick={onMobileFilterClick}
                        className="lg:hidden flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md transform hover:scale-105 active:scale-95 font-medium"
                    >
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                    </button>

                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 rounded-xl shadow-sm
                bg-white border-gray-200 text-gray-900 placeholder-gray-500
                focus:ring-2 focus:ring-green-500 focus:border-green-500
                transition-all
                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;