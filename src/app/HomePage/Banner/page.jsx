'use client';

import React, { useState, useEffect, Suspense } from 'react';
import BackgroundBlobs from './BackgroundBlobs';
import RadialBackground from './RadialBackground';
import HeroText from './HeroText';
import HeroCard from './HeroCard';
import FloatingDecorations from './FloatingDecorations';

const HeroSection = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/40 to-blue-50/50 pt-10 pb-12">
      <BackgroundBlobs />
      <RadialBackground />

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 pt-20">
        <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
          <HeroText />
          <div className="relative">
            <HeroCard />
            <Suspense fallback={null}>
              <FloatingDecorations />
            </Suspense>
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-3xl blur-2xl transition-all duration-700"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
