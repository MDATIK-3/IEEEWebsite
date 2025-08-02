'use client';
import { Filter } from "lucide-react";

const FixedFilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-32 left-4 z-40 lg:hidden flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
      aria-label="Open filters"
    >
      <Filter className="h-5 w-5" />
      <span className="text-sm font-medium">Filters</span>
    </button>
  );
};

export default FixedFilterButton; 