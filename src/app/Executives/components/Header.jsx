"use client";
import { Award, Search, Filter } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm, onMobileFilterClick }) => {
    return (
        <div className="mb-8 pb-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-5 py-2 mb-6 border border-green-100">
                        <Award className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-semibold">IEEE Green University</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Meet Our Visionary <br />
                        <span className="text-green-600">IEEE Executives</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Explore the dedicated individuals driving innovation and excellence in technology.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm text-gray-900 placeholder-gray-500"
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