'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ onClick }) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/IEEE_SB.png"
        alt="IEEE SB Logo"
        width={120}
        height={48}
        priority
        onClick={onClick}
        className="object-contain transition-opacity duration-300 hover:opacity-80"
      />
    </Link>

  );
}
