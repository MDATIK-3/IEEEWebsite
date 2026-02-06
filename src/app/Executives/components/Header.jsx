'use client';

import { Award, Search, Filter } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm, onMobileFilterClick }) => {
    return (
        <div className="mb-10 mt-10 rounded-3xl border border-emerald-100 bg-white/80 text-gray-900 shadow-2xl backdrop-blur dark:bg-slate-900/80 dark:border-emerald-900/50 dark:text-gray-200">
            <div className="px-6 py-10 sm:px-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border border-emerald-100 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-200">
                        <Award className="h-5 w-5" />
                        <span className="font-semibold">IEEE GUB Executive Council</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-emerald-700 dark:text-emerald-300">
                        Meet the leaders behind IEEE GUB
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
                        Explore the faculty advisors and student executives guiding innovation, events, and community impact.
                    </p>
                </div>

                <div className="flex flex-col gap-4 items-center justify-center max-w-4xl mx-auto">
                    <button
                        onClick={onMobileFilterClick}
                        className="lg:hidden flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-md font-semibold"
                    >
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                    </button>

                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                        <input
                            type="text"
                            placeholder="Search members by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm bg-white border-emerald-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all dark:bg-slate-800 dark:border-emerald-800 dark:text-gray-200 dark:placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
