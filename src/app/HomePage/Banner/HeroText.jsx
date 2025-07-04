'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HeroText() {
  return (
    <div className="relative text-left">
      <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl xl:text-6xl transition-all duration-500 ease-out">
        <span className="block">Bangladesh's Largest</span>
        <span className="relative inline-block mt-1 sm:mt-2">
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
            IEEE Community
          </span>
          <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-full motion-safe:animate-pulse" />
        </span>
      </h1>

      <p className="mt-4 sm:mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl leading-relaxed text-gray-600 max-w-2xl transition-all duration-700 ease-out">
        Join Bangladesh's premier IEEE Student Branch at Green University of Bangladesh, one of the leading private universities driving innovation in Computer Science, Engineering, and sustainable technology solutions.
      </p>

      <div className="mt-6 sm:mt-8 lg:mt-10 transition-all duration-700 ease-out">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            Join IEEE GUB
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-all duration-300 group-hover:translate-x-2" />
          </Link>

          <Link
            href="/Events"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:border-green-300 hover:bg-green-50/80 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
}