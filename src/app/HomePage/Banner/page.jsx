'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Particles from "@/app/components/Shares/Particles";

const DEFAULT_IMAGES = [
  { src: "/images/s3.jpg", alt: "IEEE Student Branch GUB - Advancing Technology for Humanity", priority: true },
  { src: "/images/s1.jpg", alt: "IEEE Student Branch GUB - Innovation and Excellence", priority: false },
  { src: "/images/s4.jpg", alt: "IEEE Student Branch GUB - Future Engineers and Leaders", priority: false },
];

const DEFAULT_PARTICLE_CONFIG = {
  colors: ["#006400", "#00B894", "#ffffff"],
  count: 150,
  spread: 12,
  speed: 0.08,
  baseSize: 80,
  moveOnHover: true,
  alpha: false,
  rotation: false,
};

const Banner = ({
  images = DEFAULT_IMAGES,
  autoSlideInterval = 5000,
  className = "",
  title = "IEEE Student Branch GUB",
  subtitle = "Advancing Technology for Humanity • Building Tomorrow's Engineers",
  tagline = "Green University of Bangladesh",
  particleConfig = DEFAULT_PARTICLE_CONFIG,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const particleProps = useMemo(() => ({
    particleColors: particleConfig.colors,
    particleCount: particleConfig.count,
    particleSpread: particleConfig.spread,
    speed: particleConfig.speed,
    particleBaseSize: particleConfig.baseSize,
    moveParticlesOnHover: particleConfig.moveOnHover,
    alphaParticles: particleConfig.alpha,
    disableRotation: !particleConfig.rotation,
  }), [particleConfig]);

  const handleSlideChange = useCallback((index) => {
    if (index === currentImageIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentImageIndex, isAnimating]);

  useEffect(() => {
    if (autoSlideInterval <= 0 || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval, images.length]);

  useEffect(() => {
    const styleId = 'banner-animations';
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes fadeInLeft {
        0% { opacity: 0; transform: translateX(-30px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideIn {
        0% { opacity: 0; transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
      .banner-content-animation { animation: fadeInLeft 1.5s ease-out forwards; }
      .banner-image-animation { animation: slideIn 1s ease-out forwards; }
    `;
    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = images[nextIndex].src;
      document.head.appendChild(link);
      return () => {
        if (document.head.contains(link)) document.head.removeChild(link);
      };
    }
  }, [currentImageIndex, images]);

  return (
    <section className={`relative w-full h-screen overflow-hidden ${className}`} role="banner" aria-label="IEEE Student Branch GUB Banner">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Particles {...particleProps} />
      </div>

      <div className="relative w-full h-full z-10">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover ${index === currentImageIndex ? 'banner-image-animation' : ''}`}
              priority={image.priority || index === 0}
              sizes="100vw"
              quality={85}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-green-800/30 to-transparent z-20" aria-hidden="true" />

        <div className="relative z-30 max-w-7xl h-full mx-auto px-6 flex flex-col justify-center text-white">
          <div className="banner-content-animation">

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
              <span className="text-white">{title.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              <span className="text-green-300 text-4xl md:text-6xl">{title.split(' ').slice(2).join(' ')}</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium drop-shadow-md max-w-4xl mb-8 leading-relaxed">
              {subtitle}
            </p>

            <div className="max-w-3xl">
              <blockquote className="text-lg md:text-xl text-green-100 font-light italic border-l-4 border-green-400 pl-6 mb-6">
                "IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity."
              </blockquote>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Join IEEE GUB
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                  Explore Events
                </button>
              </div>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <nav className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30" role="tablist" aria-label="Banner image navigation">
            <div className="flex space-x-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${
                    currentImageIndex === index ? "bg-white scale-110" : "bg-green-400 hover:bg-green-300"
                  }`}
                  role="tab"
                  aria-selected={currentImageIndex === index}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default Banner;
