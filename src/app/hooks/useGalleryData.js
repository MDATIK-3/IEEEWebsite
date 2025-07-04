'use client';

import { useState, useMemo, useCallback } from "react";
import photosData from "@/data/photos.json"; 

export const useGalleryData = (searchQuery = '', selectedCategory = 'All', previewCount = null) => {
  const [photos] = useState(() => {
    return photosData.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const filteredPhotos = useMemo(() => {
    let filtered = photos;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(photo =>
        (photo.name && photo.name.toLowerCase().includes(query)) ||
        (photo.date && photo.date.toLowerCase().includes(query)) ||
        (photo.description && photo.description.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      const category = selectedCategory.toLowerCase();
      filtered = filtered.filter(photo => {
        if (!photo.name) return false;
        return photo.name.toLowerCase().includes(category);
      });
    }

    if (previewCount && typeof previewCount === 'number') {
      filtered = filtered.slice(0, previewCount);
    }

    return filtered;
  }, [searchQuery, selectedCategory, photos, previewCount]);

  return {
    filteredPhotos,
    totalPhotos: photos.length,
    refresh: useCallback(() => {
    }, [])
  };
};
