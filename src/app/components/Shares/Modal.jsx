'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import Image from 'next/image';

const Modal = forwardRef(({ photos }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const showModal = currentIndex !== null;

  const photo = showModal && photos?.[currentIndex] || null;
  const imageUrl = photo ? (typeof photo === 'string' ? photo : photo.image) : null;

  const closeModal = () => setCurrentIndex(null);
  const prevPhoto = () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setCurrentIndex((i) => (i + 1) % photos.length);

  const handleDownload = async () => {
    if (!photo) return;
    const photoUrl = typeof photo === 'string' ? photo : photo.image;
    const photoName = photo.name || `Photo_${photo.id || currentIndex}`;

    try {
      const res = await fetch(photoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photoName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  useImperativeHandle(ref, () => ({
    open: setCurrentIndex,
  }));

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'ArrowRight') nextPhoto();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [showModal, photos]);

  if (!showModal || !photos?.length) return null;

  const isValidDate = photo?.date && !isNaN(new Date(photo.date).getTime());

  return (
    <div
      className="fixed inset-0 top-10 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="relative w-[90vw] h-[80vh] max-w-4xl bg-black/20 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={typeof photo === 'string' ? `Photo ${currentIndex + 1}` : (photo.name || `Photo ${photo.id}`)}
          width={400}
          height={300}
          className="w-full h-full object-contain"
        />

        {isValidDate && (
          <div className="absolute bottom-4 left-4 right-4 sm:bg-black/50 sm:backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{photo.name || null}</h3>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="px-4 py-2 flex items-center gap-2 rounded-2xl font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110">
                <Calendar className="w-4 h-4" />
                {new Date(photo.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200"
          aria-label="Download"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={prevPhoto}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition-all shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextPhoto}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition-all shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
});

export default Modal;
