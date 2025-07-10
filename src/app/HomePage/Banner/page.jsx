'use client';
import dynamic from 'next/dynamic';
import RadialBackground from './RadialBackground';
import HeroText from './HeroText';
import HeroCard from './HeroCard';

const BackgroundBlobs = dynamic(() => import('./BackgroundBlobs'), { ssr: false });
const FloatingDecorations = dynamic(() => import('./FloatingDecorations'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/40 to-blue-50/50 flex items-center justify-center
      pt-16 pb-8 px-4
      sm:pt-20 sm:pb-10 sm:px-6
      lg:pt-[56px] lg:pb-10 lg:px-8">

      <BackgroundBlobs />
      <RadialBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-lg
          sm:gap-10 sm:max-w-2xl
          lg:max-w-full lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-12">

          <div className="order-1 lg:order-1">
            <HeroText />
          </div>

          <div className="relative order-2 lg:order-2">
            <HeroCard />
            <FloatingDecorations />

            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-xl transition-all duration-700 
              -z-10 scale-105
              sm:scale-110
              lg:scale-105" />
          </div>
        </div>
      </div>
    </section>
  );
}