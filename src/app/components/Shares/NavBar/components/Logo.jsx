'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ width = 120, height = 48, onClick }) {
  return (
    <Link href="/" className="flex items-center" onClick={onClick}>
      <Image
        src="/images/IEEE_SB.png"
        alt="IEEE SB Logo"
        width={width}
        height={height}
        priority
        draggable={false}
        className="object-contain transition-opacity duration-300 hover:opacity-80"
      />
    </Link>
  );
}
