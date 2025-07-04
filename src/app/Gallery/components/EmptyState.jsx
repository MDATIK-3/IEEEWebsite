'use client';

import { Camera } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-2xl opacity-60 scale-150 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full p-6 sm:p-8 border border-emerald-100 shadow-lg shadow-emerald-500/10">
          <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500 animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">
        No Photos Found
      </h3>

      <p className="text-gray-500 text-center mb-8 max-w-md leading-relaxed text-sm sm:text-base">
        We couldn't find any photos matching your current criteria. Try adjusting your search or filter settings to discover more content.
      </p>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-200 rounded-full opacity-30 animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-300 rounded-full opacity-40 animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-25 animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      </div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
};

export default EmptyState;