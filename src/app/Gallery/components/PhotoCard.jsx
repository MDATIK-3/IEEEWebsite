'use client';

import { Calendar } from "lucide-react";
import Image from "next/image";

const PhotoCard = ({ photo, viewMode, onClick, index }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className={`p-4 ${viewMode === 'grid'
          ? 'absolute bottom-0 left-0 right-0 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 via-black/30 to-transparent'
          : 'flex-1'
        }`}>
        <h3 className={`font-semibold ${viewMode === 'list' ? 'text-xl text-slate-800 mb-2' : 'text-lg'
          }`}>
          {photo.name || `Photo ${photo.id}`}
        </h3>
        <div className={`flex items-center gap-2 text-sm ${viewMode === 'grid' ? 'text-slate-200' : 'text-slate-500'
          }`}>
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
          <p className="text-slate-600 mt-3 text-sm">
            {photo.description || `An event from ${photo.date}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;
