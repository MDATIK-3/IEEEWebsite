'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const PhotoCard = ({ photo, index, photos }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleOpenModal = useCallback(() => {
    setCurrentIndex(index);
    setShowModal(true);
  }, [index]);

  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length);

  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const currentPhoto = photos[currentIndex];

  return (
    <>
      <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={handleOpenModal}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}

          {!imageError ? (
            <img
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
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
              <span>No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <div className="bg-white/80 p-1.5 rounded-full shadow-md backdrop-blur-sm">
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 truncate">{photo.name}</h3>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 top-10 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center bg-white">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.name}
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <h3 className="text-white font-medium">{currentPhoto.name}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoCard;
