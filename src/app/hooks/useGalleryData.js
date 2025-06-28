'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

export const useGalleryData = (searchQuery = '', selectedCategory = 'All', previewCount = null) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const photosCache = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/photos.json", {
          signal: abortControllerRef.current.signal
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        photosCache.current = sorted;
        setPhotos(sorted);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch photos:", err);
          setError(err.message);
        }
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

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    loading, 
    error,
    totalPhotos: photos.length,
    refresh: useCallback(() => {
      photosCache.current = null;
      setPhotos([]);
      setLoading(true);
    }, [])
  };
};
