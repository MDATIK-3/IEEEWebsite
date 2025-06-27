'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import PhotoGrid from "./PhotoGrid";

const GalleryPreview = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/photos.json');
        const data = await res.json();
        const sorted = data.sort((a, b) => a.id - b.id);
        setPhotos(sorted);
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    };

    fetchPhotos();
  }, []);

  const previewPhotos = photos.slice(0, 6);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
            IEEE GUB Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of{" "}
            <span className="font-bold text-emerald-700">{photos.length}</span>{" "}
            memorable moments and inspiring achievements.
          </p>
        </div>

        <PhotoGrid photos={previewPhotos} />

        <div className="text-center mt-12">
          <Link href="/Gallery">
            <button className="relative inline-flex items-center gap-2 overflow-hidden px-10 py-4 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-lg transition-all duration-300 group">
              View Full Gallery
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
