'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, Calendar } from 'lucide-react';
import Image from 'next/image';

const PhotoCard = ({ 
  photo, 
  index, 
  photos, 
  viewMode = 'grid', 
  onClick,
  variant = 'gallery', 
  showModal = false,
  onModalToggle,
  Modal 
}) => {
  const modalRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [internalShowModal, setInternalShowModal] = useState(false);
  const [pendingIndex, setPendingIndex] = useState(null);


  useEffect(() => {
    if (variant === 'homepage' && internalShowModal && modalRef.current && pendingIndex !== null) {
      modalRef.current.open(pendingIndex);
      setPendingIndex(null);
    }
  }, [internalShowModal, pendingIndex, variant]);

  const handleClick = () => {
    if (variant === 'homepage') {
      setPendingIndex(index);
      setInternalShowModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  //Common image error fallback
  const renderImageFallback = () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
      <span>No image</span>
    </div>
  );

  //for main Gallery page
  if (variant === 'gallery') {
    return (
      <div
        className={`group relative overflow-hidden rounded-xl 
          bg-white shadow-md hover:shadow-lg dark:bg-zinc-900 dark:shadow-lg
          transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in
          ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={handleClick}
      >
        <div
          className={`relative overflow-hidden ${viewMode === 'list'
            ? 'w-full h-52 sm:w-64 sm:h-auto flex-shrink-0'
            : 'w-full h-[220px]'
          }`}
        >
          {!imageError ? (
            <Image
              src={photo.image}
              alt={photo.name || `Photo ${photo.id}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            renderImageFallback()
          )}
        </div>

        <div className={`p-4 ${viewMode === 'grid'
          ? `absolute bottom-0 left-0 right-0 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100
               bg-gradient-to-t from-emerald-700/80 via-emerald-600/50 to-transparent
               dark:from-emerald-800/90 dark:via-emerald-700/60 dark:to-transparent`
          : 'flex-1'
        }`}
        >
          <h3
            className={`font-semibold ${viewMode === 'list'
              ? 'text-xl text-slate-800 dark:text-gray-100 mb-2'
              : 'text-lg'
            }`}
          >
            {photo.name || `Photo ${photo.id}`}
          </h3>

          <div
            className={`flex items-center gap-2 text-sm ${viewMode === 'grid'
              ? 'text-slate-200 dark:text-gray-300'
              : 'text-slate-500 dark:text-gray-400'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>
              {new Date(photo.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {viewMode === 'list' && (
            <p className="mt-3 text-sm text-slate-600 dark:text-gray-400">
              {photo.description || `An event from ${photo.date}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  //for HomePage Gallery
  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div
          className="relative aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}

          {!imageError ? (
            <Image
              src={photo.image}
              alt={photo.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
              width={800}
              height={600}
            />
          ) : (
            renderImageFallback()
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="p-2 rounded-full shadow backdrop-blur-sm bg-white hover:scale-110 transform transition">
                <ZoomIn className="w-5 h-5 text-gray-800" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {photo.name}
          </h3>
        </div>
      </div>

      {internalShowModal && Modal && <Modal ref={modalRef} photos={photos} />}
    </>
  );
};

export default PhotoCard;
