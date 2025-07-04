'use client';

import Image from "next/image";
import { Image as IconImage } from 'lucide-react';

const GallerySection = ({ event, isPastEvent, onImageClick }) => {
  if (!isPastEvent || !Array.isArray(event.gallery) || event.gallery.length === 0) {
    return null;
  }

  const formatSrc = (src) => (src?.startsWith('/') ? src : `/${src}`);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
        <button
          onClick={() => onImageClick(0)}
          aria-label="View full gallery"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
        >
          <IconImage className="w-4 h-4 mr-2" />
          View Gallery
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {event.gallery.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={formatSrc(img.image || img)}
              alt={`Event image ${i + 1}`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
