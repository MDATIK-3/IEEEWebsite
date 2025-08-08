'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ onClick }) {
  
  const logos = [
    { src: '/images/IEEE_SB.png', mode: 'light', shimmer: 'via-white/90' },
    { src: '/images/IEEEGUB SB logo white.png', mode: 'dark', shimmer: 'via-white/20' },
  ];

  return (
    <Link href="/" className="flex items-center">
      {logos.map((logo, i) => (
        <div
          key={i}
          className={`relative group overflow-hidden 
            ${logo.mode === 'light' ? 'dark:hidden' : 'hidden dark:block'}`}
        >
          {/* Logo image */}
          <Image
            src={logo.src}
            alt={`IEEE SB Logo ${logo.mode}`}
            width={120}
            height={48}
            priority
            onClick={onClick}
            className="object-contain transition-opacity duration-300 hover:opacity-80"
          />

          {/* Continuous shimmer effect */}
          <div
            className={`absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent ${logo.shimmer} to-transparent skew-x-12 pointer-events-none`}
            style={{
              width: '100%',
              height: '100%',
              transform: 'translateX(-100%)',
              animation: 'shimmer 2.5s infinite ease-in-out',
            }}
          />
        </div>
      ))}
    </Link>
  );
}
