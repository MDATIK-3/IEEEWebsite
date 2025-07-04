'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import Modal from "@/app/components/Shares/Modal";
import Image from 'next/image';

const PhotoCard = ({ photo, index, photos }) => {
  const modalRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingIndex, setPendingIndex] = useState(null);

  useEffect(() => {
    if (showModal && modalRef.current && pendingIndex !== null) {
      modalRef.current.open(pendingIndex);
      setPendingIndex(null);
    }
  }, [showModal, pendingIndex]);

  const handleClick = () => {
    setPendingIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
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

      {showModal && <Modal ref={modalRef} photos={photos} />}
    </>
  );
};

export default PhotoCard;
