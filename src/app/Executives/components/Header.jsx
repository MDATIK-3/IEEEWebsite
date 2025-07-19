'use client';
import { useTheme } from '@/app/Theme/ThemeProvider';
import { Award, Search, Filter } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm, onMobileFilterClick }) => {
    const { isDark } = useTheme();

    return (
        <div className={`${isDark ? 'bg-gray-900 border border-gray-700 text-gray-300' : 'bg-white border border-gray-200 text-gray-900'} mb-8 pb-8 rounded-2xl shadow-lg`}>
            <div className="p-8">
                <div className="text-center mb-8">
                    <div className={`${isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-100'} inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border`}>
                        <Award className="h-5 w-5 text-green-400" />
                        <span className={`${isDark ? 'text-green-400' : 'text-green-700'} font-semibold`}>IEEE Green University</span>
                    </div>

                    <h1 className={`${isDark ? 'text-gray-300' : 'text-gray-900'} text-4xl md:text-6xl font-bold mb-4 leading-tight`}>
                        Meet Our Visionary <br />
                        <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>IEEE Executives</span>
                    </h1>

                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto leading-relaxed`}>
                        Explore the dedicated individuals driving innovation and excellence in technology.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <Search className={`${isDark ? 'text-gray-400' : 'text-gray-400'} absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5`} />
                        <input
                            type="text"
                            placeholder="Search members by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm`}
                        />
                    </div>

                    <button
                        onClick={onMobileFilterClick}
                        className="lg:hidden flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md transform hover:scale-105 active:scale-95"
                    >
                        <Filter className="h-5 w-5" />
                        <span className="font-medium">Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
