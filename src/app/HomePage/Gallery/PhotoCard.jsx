'use client';

import { useCallback, useEffect, useState } from 'react';
import {ZoomIn } from 'lucide-react';
import Modal from './Modal';
import Image from 'next/image';

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
      <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div
          className="relative aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={handleOpenModal}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}

          {!imageError ? (
            <Image
              src={photo.image}
              alt={photo.name}
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-105`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              loading="lazy"
              width={800}
              height={600}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
              <span>No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="bg-white/80 p-2 rounded-full shadow backdrop-blur-sm hover:scale-110 transform transition">
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

      {showModal && (
        <Modal
          currentPhoto={currentPhoto}
          handleCloseModal={handleCloseModal}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}
    </>

  );
};

export default PhotoCard;
