'use client';

import { useState, useCallback } from "react";
import photosData from "@/data/photos.json"; 

export const useGalleryData = (searchQuery = '', selectedCategory = 'All', previewCount = null) => {
  const [photos] = useState(() => {
    return photosData.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  let filteredPhotos = photos;

  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredPhotos = filteredPhotos.filter(photo =>
      (photo.name && photo.name.toLowerCase().includes(query)) ||
      (photo.date && photo.date.toLowerCase().includes(query)) ||
      (photo.description && photo.description.toLowerCase().includes(query))
    );
  }

  if (selectedCategory && selectedCategory !== 'All') {
    const category = selectedCategory.toLowerCase();
    filteredPhotos = filteredPhotos.filter(photo => {
      if (!photo.name) return false;
      return photo.name.toLowerCase().includes(category);
    });
  }

  if (previewCount && typeof previewCount === 'number') {
    filteredPhotos = filteredPhotos.slice(0, previewCount);
  }

  return {
    filteredPhotos,
    totalPhotos: photos.length,
    refresh: useCallback(() => {}, [])
  };
};
