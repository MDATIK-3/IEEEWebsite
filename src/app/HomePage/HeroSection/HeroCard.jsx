'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import ShimmerEffect from "@/app/components/ShimmerEffect";

const images = [
  "/images/hero.jpg",
  "/images/s3.jpg",
  "/images/s4.jpg",
];

export default function HeroCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide]);

  return (
    <div className="relative z-10">
      <div className="relative bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 overflow-hidden transition-all duration-500 hover:shadow-3xl">
        {/* Background pulses */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl motion-safe:animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-xl motion-safe:animate-pulse"></div>

        {/* Image Slider */}
        <div 
          className="flex justify-center mb-6 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border group-hover:border-green-200 transition-all duration-500 w-full max-w-[640px] h-[200px] sm:h-[270px] md:h-[320px]">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
            
            {/* Navigation Arrows */}
            {/* Removed ChevronLeft and ChevronRight buttons */}
            
            {/* Image with fade transition */}
            <div className="relative w-full h-full">
              {images.map((image, index) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt="Technology Innovation"
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    loading="eager"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-green-400 scale-125' 
                      : 'bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
              
            </div>
            <ShimmerEffect/>
          </div>
        </div>

        {/* Text */}
        <div className="text-center transition-all duration-500">
          <p className="text-lg font-bold text-gray-800 mb-2">Building Tomorrow</p>
          <p className="text-sm text-gray-600">Innovation • Collaboration • Excellence</p>
        </div>
       
      </div>
      
    </div>
  );
}
