'use client';

import Link from 'next/link';
import PhotoGrid from './PhotoGrid';
import { useGalleryData } from '@/app/hooks/useGalleryData';

const GalleryPreview = () => {
  const { filteredPhotos, loading, error, totalPhotos } = useGalleryData('', 'All', 6);

  if (loading) {
    return (
      <section className="relative overflow-hidden py-20 bg-white dark:bg-gray-950">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 max-w-md"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8 max-w-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden py-20 bg-white dark:bg-gray-950">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error loading gallery: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-20 bg-white dark:bg-gray-950">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-500 bg-clip-text text-transparent mb-4">
            IEEE GUB Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{totalPhotos}</span>{' '}
            memorable moments and inspiring achievements.
          </p>
        </div>

        <PhotoGrid photos={filteredPhotos} />

        <div className="text-center mt-12">
          <Link href="/Gallery" passHref>
            <button className="relative inline-flex items-center gap-2 overflow-hidden px-10 py-4 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-xl dark:shadow-emerald-900 transition-all duration-300 group">
              View Full Gallery
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
