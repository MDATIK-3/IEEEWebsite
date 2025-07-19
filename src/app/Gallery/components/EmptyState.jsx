'use client';

import { Camera } from 'lucide-react';
import { useTheme } from '@/app/Theme/ThemeProvider';

const EmptyState = () => {
  const { isDark } = useTheme();

  const bgGradient = isDark
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-emerald-50 to-teal-50';

  const pulseGradient = isDark
    ? 'from-emerald-700 to-teal-700 opacity-40'
    : 'from-emerald-100 to-teal-100 opacity-60';

  const borderColor = isDark ? 'border-emerald-700' : 'border-emerald-100';
  const shadowColor = isDark ? 'shadow-emerald-900/30' : 'shadow-emerald-500/10';
  const iconColor = isDark ? 'text-emerald-400' : 'text-emerald-500';
  const textColorTitle = isDark ? 'text-gray-300' : 'text-gray-800';
  const textColorDesc = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`relative flex flex-col rounded-xl items-center justify-center py-16 sm:py-24 px-4 ${bgGradient}`}>
      
      <div className="relative mb-8">
        <div className={`absolute inset-0 rounded-full blur-2xl scale-150 animate-pulse bg-gradient-to-br ${pulseGradient}`}></div>
        <div className={`relative rounded-full p-6 sm:p-8 border ${borderColor} shadow-lg ${shadowColor}`}>
          <Camera className={`w-12 h-12 sm:w-16 sm:h-16 animate-bounce ${iconColor}`} style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      <h3 className={`text-2xl sm:text-3xl font-bold mb-3 text-center ${textColorTitle}`}>
        No Photos Found
      </h3>

      <p className={`text-center mb-8 max-w-md leading-relaxed text-sm sm:text-base ${textColorDesc}`}>
        We couldn't find any photos matching your current criteria. Try adjusting your search or filter settings to discover more content.
      </p>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-ping bg-emerald-600 opacity-30`} style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className={`absolute top-1/3 right-1/3 w-1 h-1 rounded-full animate-ping bg-teal-600 opacity-40`} style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className={`absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full animate-ping bg-emerald-600 opacity-25`} style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className={`absolute top-2/3 right-1/4 w-1 h-1 rounded-full animate-ping bg-emerald-600 opacity-20`} style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
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
