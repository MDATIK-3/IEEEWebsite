'use client';

import { useTheme } from '@/app/Theme/ThemeProvider';
import { Search, Grid, List } from "lucide-react";

const categories = ['All', 'Summit', 'Conference', 'Workshop', 'Seminar', 'Event'];

const GalleryControls = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode
}) => {
    const { isDark } = useTheme();

    return (
        <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-900 bg-opacity-80 border-gray-700' : 'bg-white/40 border-white/20'} backdrop-blur-lg border-b shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-around">

                    <div className="relative w-full sm:flex-1 sm:max-w-md lg:max-w-lg">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 ${isDark ? 'bg-gray-800 bg-opacity-80 border-gray-700 placeholder-emerald-400 text-gray-300' : 'bg-white/70 border border-slate-200 placeholder-slate-700 text-slate-700'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 sm:flex-shrink-0">

                        <div className="flex-1 sm:flex-initial min-w-0">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`w-full sm:w-auto min-w-[120px] appearance-none px-3 sm:px-4 py-2.5 sm:py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer ${isDark ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300' : 'bg-white/70 border border-slate-200 text-slate-700'}`}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category} className={isDark ? 'bg-gray-800 text-gray-300' : ''}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-shrink-0">
                            <div className={`flex items-center rounded-full p-1 border ${isDark ? 'bg-gray-800 bg-opacity-80 border-gray-700' : 'bg-white/70 border border-slate-200'}`}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : isDark
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    aria-label="Grid View"
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : isDark
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    aria-label="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default GalleryControls;
