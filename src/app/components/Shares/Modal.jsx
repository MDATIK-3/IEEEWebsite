'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const Modal = forwardRef(({ photos }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const showModal = currentIndex !== null;

  const handleCloseModal = () => setCurrentIndex(null);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % photos.length);

  useImperativeHandle(ref, () => ({
    open: (index) => setCurrentIndex(index),
  }));

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

  if (!showModal || !photos || !photos.length) return null;

  const photo = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 top-10 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleCloseModal}
    >
      <div
        className="relative max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.image}
          alt={photo.name || `Photo ${photo.id}`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />

        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="text-xl font-bold mb-2">{photo.name || `Photo ${photo.id}`}</h3>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="px-4 py-2 flex items-center gap-2 rounded-2xl text-white font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110">
              <Calendar className="w-4 h-4" />
              {new Date(photo.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
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
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
export default Modal;
