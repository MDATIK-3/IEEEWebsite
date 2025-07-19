'use client';

import { Calendar } from "lucide-react";
import Image from "next/image";
import { useTheme } from '@/app/Theme/ThemeProvider';

const PhotoCard = ({ photo, viewMode, onClick, index }) => {
  const { isDark } = useTheme();

  const containerBgClass = isDark ? 'bg-gray-800 shadow-md hover:shadow-lg' : 'bg-white shadow';
  const textColorGrid = isDark ? 'text-gray-300' : 'text-slate-200';
  const textColorList = isDark ? 'text-gray-300' : 'text-slate-800';
  const descriptionColor = isDark ? 'text-gray-400' : 'text-slate-600';
  const gradientOverlay = isDark
    ? 'bg-gradient-to-t from-black/80 via-black/50 to-transparent'
    : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent';

  return (
    <div
      className={`group relative overflow-hidden rounded-xl ${containerBgClass} transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
        }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden ${viewMode === 'list'
            ? 'w-full h-52 sm:w-64 sm:h-auto flex-shrink-0'
            : 'w-full h-[220px]'
          }`}
      >
        <Image
          src={photo.image}
          alt={photo.name || `Photo ${photo.id}`}
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradientOverlay}`} />
      </div>

      <div className={`p-4 ${viewMode === 'grid'
          ? `absolute bottom-0 left-0 right-0 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 ${gradientOverlay}`
          : 'flex-1'
        }`}>
        <h3 className={`font-semibold ${viewMode === 'list' ? `text-xl ${textColorList} mb-2` : 'text-lg'}`}>
          {photo.name || `Photo ${photo.id}`}
        </h3>
        <div className={`flex items-center gap-2 text-sm ${viewMode === 'grid' ? textColorGrid : 'text-slate-500'}`}>
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(photo.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        {viewMode === 'list' && (
          <p className={`${descriptionColor} mt-3 text-sm`}>
            {photo.description || `An event from ${photo.date}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;
