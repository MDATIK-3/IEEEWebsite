'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ onClick }) {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative group overflow-hidden">
        <Image
          src="/images/IEEE_SB.png"
          alt="IEEE SB Logo"
          width={120}
          height={48}
          priority
          onClick={onClick}
          className="object-contain transition-opacity duration-300 hover:opacity-80"
        />
        {/* Custom continuous shimmer effect for navbar logo only */}
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-white/20 to-transparent skew-x-12 pointer-events-none" style={{
          width: '100%',
          height: '100%',
          transform: 'translateX(-100%)',
          animation: 'shimmer 2.5s infinite ease-in-out'
        }} />
      </div>
    </Link>
  );
}
