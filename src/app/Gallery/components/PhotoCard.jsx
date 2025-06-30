'use client';

import { Calendar } from "lucide-react";

const PhotoCard = ({ photo, viewMode, onClick, index }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <div className={`relative ${
        viewMode === 'list' 
          ? 'w-full h-48 sm:w-64 sm:h-auto flex-shrink-0' 
          : 'aspect-square'
      } overflow-hidden`}>
        <img
          src={photo.image}
          alt={photo.name || `Photo ${photo.id}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className={`p-4 ${
        viewMode === 'grid' 
          ? 'absolute bottom-0 left-0 right-0 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100' 
          : 'flex-1'
      }`}>
        <h3 className={`font-semibold ${
          viewMode === 'list' ? 'text-xl text-slate-800 mb-2' : 'text-lg'
        }`}>
          {photo.name || `Photo ${photo.id}`}
        </h3>
        <div className={`flex items-center gap-2 text-sm ${
          viewMode === 'grid' ? 'text-slate-200' : 'text-slate-500'
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