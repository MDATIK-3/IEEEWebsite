'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import PhotoCard from "./PhotoCard";

const AllPhoto = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/photos.json');
        const data = await response.json();
        const sorted = data.sort((a, b) => a.id - b.id);
        setPhotos(sorted);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const previewPhotos = photos.slice(0, 8);

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
          Gallery
        </h2>
        <Link href="/gal">
          <button className="inline-block bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
            Explore More
          </button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {previewPhotos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  );
};

export default AllPhoto;
