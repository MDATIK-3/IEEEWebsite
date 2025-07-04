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

  return (
    <div className="flex justify-center items-center py-4 px-2">
      <nav className="flex items-center gap-2" role="navigation" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400 transition-colors" />
        </button>
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-8 h-8 text-gray-400 text-sm select-none"
              aria-hidden="true"
            >
              ···
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-400 hover:text-emerald-600'
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
          className="group flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-300 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 group-disabled:text-gray-400 transition-colors" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
