'use client';

import { useState, useEffect, useRef } from "react";
import { useGalleryData } from "../hooks/useGalleryData";
import GalleryControls from "./components/GalleryControls";
import PhotoCard from "../components/common/PhotoCard";
import Pagination from "./components/Pagination";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "@/app/components/Shares/Modal";
import BgColor from "../components/BgColor";

const ITEMS_PER_PAGE = 18;

const GalleryFull = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [pendingIndex, setPendingIndex] = useState(null);
    const modalRef = useRef();

    const { filteredPhotos, loading } = useGalleryData(searchQuery, selectedCategory);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        if (showModal && modalRef.current && pendingIndex !== null) {
            modalRef.current.open(pendingIndex);
            setPendingIndex(null);
        }
    }, [showModal, pendingIndex]);

    const totalPages = Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pagedPhotos = filteredPhotos.slice(start, start + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePhotoClick = (photo) => {
        const indexInFiltered = filteredPhotos.findIndex(p => p.id === photo.id);
        if (indexInFiltered !== -1) {
            setPendingIndex(indexInFiltered);
            setShowModal(true);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="relative pt-20 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/25 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(79, 70, 229, 0.05) 1px, transparent 1px), 
                                      linear-gradient(to bottom, rgba(79, 70, 229, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
            <div className="relative z-10">
                <GalleryControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {filteredPhotos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="mb-8 text-center">
                                <p className="text-slate-600 dark:text-gray-300">
                                    Showing {pagedPhotos.length} of {filteredPhotos.length} photos
                                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                                    {searchQuery && ` matching "${searchQuery}"`}
                                </p>
                            </div>

                            <div className={`grid gap-6 mb-12 ${viewMode === 'grid'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1 lg:grid-cols-2'
                                }`}>
                                {pagedPhotos.map((photo, index) => (
                                    <PhotoCard
                                        key={photo.id}
                                        photo={photo}
                                        viewMode={viewMode}
                                        index={index}
                                        variant="gallery"
                                        onClick={() => handlePhotoClick(photo)}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </main>
            </div>
            <BgColor />

            {showModal && <Modal ref={modalRef} photos={filteredPhotos} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default GalleryFull;
