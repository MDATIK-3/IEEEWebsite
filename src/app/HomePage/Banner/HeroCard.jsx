'use client';

import Image from "next/image";

export default function HeroCard() {
  return (
    <div className="relative z-10">
      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 overflow-hidden transition-all duration-500 ease-out hover:shadow-3xl"
      >
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl motion-safe:animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-xl motion-safe:animate-pulse"></div>

        <div className="flex justify-center mb-6 group">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white group-hover:border-green-200 transition-all duration-500 w-[320px] h-[200px] sm:w-[480px] sm:h-[270px] md:w-[640px] md:h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Image
              src="/images/hero.jpg"
              alt="Technology Innovation"
              fill
              sizes="(max-width: 640px) 320px, (max-width: 768px) 480px, 640px"
              loading="eager"
              priority={true}
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>

        <div className="text-center transition-all duration-500">
          <p className="text-lg font-bold text-gray-800 mb-2">Building Tomorrow</p>
          <p className="text-sm text-gray-600">Innovation • Collaboration • Excellence</p>
        </div>
      </div>
    </div>
  );
}