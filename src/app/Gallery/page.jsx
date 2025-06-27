'use client';

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PhotoGrid from "@/app/HomePage/Gallery/PhotoGrid";

const ITEMS_PER_PAGE = 18;

const GalleryFull = () => {
  const [photos, setPhotos] = useState([]);
  const photosCache = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    if (photosCache.current) {
      setPhotos(photosCache.current);
      return;
    }

    const fetchPhotos = async () => {
      try {
        const res = await fetch("/photos.json");
        const data = await res.json();
        const sorted = data.sort((a, b) => a.id - b.id);
        photosCache.current = sorted;
        setPhotos(sorted);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      }
    };

    fetchPhotos();
  }, []);

  const totalPages = useMemo(() => Math.ceil(photos.length / ITEMS_PER_PAGE), [photos.length]);
  const pagedPhotos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return photos.slice(start, start + ITEMS_PER_PAGE);
  }, [photos, currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage) router.push(`/Gallery?page=${page}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-emerald-50 to-white min-h-screen py-24 px-4 sm:px-6 lg:px-12">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16,185,129,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-700 drop-shadow-md">
            IEEE GUB Photo Gallery
          </h1>
          <p className="mt-6 text-lg text-emerald-900 max-w-xl mx-auto leading-relaxed">
            Explore {photos.length} unforgettable moments captured from our events, seminars, and celebrations.
          </p>
        </header>

        <PhotoGrid photos={pagedPhotos} cardClassName="rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer" />

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-14 flex justify-center flex-wrap gap-3 select-none"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-300
                  ${
                    currentPage === page
                      ? "bg-emerald-700 text-white shadow-lg"
                      : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                  }
                `}
              >
                {page}
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
};

export default GalleryFull;
