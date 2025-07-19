'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from '@/app/Theme/ThemeProvider';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDark } = useTheme();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages > 0) pageNumbers.push(1);
    if (currentPage > 4) pageNumbers.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 3) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers.filter((page, index, arr) => arr.indexOf(page) === index);
  };

  const baseButtonClass = `group flex items-center justify-center w-8 h-8 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed`;
  const lightBgClass = `bg-white border border-gray-300 hover:border-emerald-400`;
  const darkBgClass = `bg-gray-800 border border-gray-600 hover:border-emerald-500`;
  const lightTextClass = `text-gray-700 hover:text-emerald-600`;
  const darkTextClass = `text-gray-300 hover:text-emerald-400`;
  const disabledLightText = `group-disabled:text-gray-400`;
  const disabledDarkText = `group-disabled:text-gray-600`;

  return (
    <div className="flex justify-center items-center py-4 px-2">
      <nav className="flex items-center gap-2" role="navigation" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseButtonClass} ${isDark ? darkBgClass : lightBgClass} ${isDark ? darkTextClass : lightTextClass} ${isDark ? disabledDarkText : disabledLightText}`}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={`w-4 h-4 transition-colors ${isDark ? 'text-gray-300 group-hover:text-emerald-400 group-disabled:text-gray-600' : 'text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400'}`} />
        </button>
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <div
              key={`ellipsis-${index}`}
              className={`flex items-center justify-center w-8 h-8 text-gray-400 text-sm select-none ${isDark ? 'text-gray-500' : ''}`}
              aria-hidden="true"
            >
              ···
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${baseButtonClass} ${currentPage === page ? 'bg-emerald-600 text-white' : isDark ? darkBgClass + ' ' + darkTextClass : lightBgClass + ' ' + lightTextClass} `}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClass} ${isDark ? darkBgClass : lightBgClass} ${isDark ? darkTextClass : lightTextClass} ${isDark ? disabledDarkText : disabledLightText}`}
          aria-label="Go to next page"
        >
          <ChevronRight className={`w-4 h-4 transition-colors ${isDark ? 'text-gray-300 group-hover:text-emerald-400 group-disabled:text-gray-600' : 'text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400'}`} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
