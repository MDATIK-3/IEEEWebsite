'use client';

import dynamic from 'next/dynamic';
import RadialBackground from './RadialBackground';
import HeroText from './HeroText';
import HeroCard from './HeroCard';
const BackgroundBlobs = dynamic(() => import('./BackgroundBlobs'), { ssr: false });
const FloatingDecorations = dynamic(() => import('./FloatingDecorations'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/40 to-blue-50/50 flex items-center justify-center">
      <BackgroundBlobs />
      <RadialBackground />

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
        <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
          <HeroText />
          <div className="relative">
            <HeroCard />
            <FloatingDecorations />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-xl transition-all duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
