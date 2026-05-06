'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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

  const baseBtn = `group flex items-center justify-center w-8 h-8 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed`;
  const bg = `bg-white border border-gray-300 hover:border-emerald-400 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-emerald-500`;
  const text = `text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400`;
  const disabledText = `group-disabled:text-gray-400 dark:group-disabled:text-gray-600`;

  return (
    <div className="flex justify-center items-center py-4 px-2">
      <nav className="flex items-center gap-2" role="navigation" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseBtn} ${bg} ${text} ${disabledText}`}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 transition-colors text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400 dark:text-gray-300 dark:group-hover:text-emerald-400 dark:group-disabled:text-gray-600" />
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-8 h-8 text-sm text-gray-400 dark:text-gray-500 select-none"
              aria-hidden="true"
            >
              ···
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${baseBtn} ${currentPage === page
                ? 'bg-emerald-600 text-white'
                : `${bg} ${text}`
                }`}
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
          className={`${baseBtn} ${bg} ${text} ${disabledText}`}
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4 transition-colors text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400 dark:text-gray-300 dark:group-hover:text-emerald-400 dark:group-disabled:text-gray-600" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
