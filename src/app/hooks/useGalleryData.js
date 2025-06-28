'use client';

import { useState, useEffect, useMemo, useRef } from "react";

export const useGalleryData = (searchQuery, selectedCategory) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const photosCache = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/photos.json");
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        photosCache.current = sorted;
        setPhotos(sorted);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (photosCache.current) {
      setPhotos(photosCache.current);
      setLoading(false);
    } else {
      fetchPhotos();
    }
  }, []);

  const filteredPhotos = useMemo(() => {
    let filtered = photos;

    if (searchQuery) {
      filtered = filtered.filter(photo =>
        (photo.name && photo.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (photo.date && photo.date.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(photo => {
        if (!photo.name) return false;
        return photo.name.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, photos]);

  return { filteredPhotos, loading };
};
