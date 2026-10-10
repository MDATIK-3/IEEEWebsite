'use client';

import { useState, useEffect, useMemo, useCallback } from "react";

// Gallery photos now live in the database. This hook fetches them once from the
// public `/api/gallery` route, then does the search / category / preview
// filtering client-side (unchanged behaviour), exposing loading + error so
// callers can show skeletons.
export const useGalleryData = (searchQuery = '', selectedCategory = 'All', previewCount = null) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    fetch('/api/gallery', { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setPhotos(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load gallery');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  const sorted = useMemo(
    () => photos.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [photos]
  );

  const filteredPhotos = useMemo(() => {
    let result = sorted;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((photo) =>
        (photo.name && photo.name.toLowerCase().includes(query)) ||
        (photo.date && photo.date.toLowerCase().includes(query)) ||
        (photo.description && photo.description.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      const category = selectedCategory.toLowerCase();
      result = result.filter((photo) => {
        if (!photo.name) return false;
        return photo.name.toLowerCase().includes(category);
      });
    }

    if (previewCount && typeof previewCount === 'number') {
      result = result.slice(0, previewCount);
    }

    return result;
  }, [sorted, searchQuery, selectedCategory, previewCount]);

  return {
    filteredPhotos,
    totalPhotos: photos.length,
    loading,
    error,
    refresh: load,
  };
};
