'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/Events', label: 'Events' },
  { href: '/Executives', label: 'Executives' },
  { href: '/Gallery', label: 'Gallery' },
];

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const activeLink =
    'text-green-500 border-b-2 border-green-500 font-medium tracking-wide';
  const defaultLink =
    'font-light tracking-wide text-gray-700 hover:text-green-500 focus:outline-none focus:text-green-500 transition-all duration-300 ease-out';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/IEEE_SB.png"
              alt="IEEE SB Logo"
              width={120}
              height={48}
              priority
              draggable={false}
              className="object-contain transition-opacity duration-300 hover:opacity-80"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <ul className="hidden lg:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cx(
                      pathname === href ? activeLink : defaultLink
                    )}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="lg:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={cx(
          'lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/images/IEEE_SB.png"
              alt="IEEE SB Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </Link>
          <button
            onClick={toggleMobileMenu}
            aria-label="Close menu"
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 py-6">
          <ul className="space-y-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMobileMenu}
                  className={cx(
                    'block text-lg py-3 px-4 rounded-lg transition-all duration-200',
                    pathname === href
                      ? 'text-green-500 bg-green-50 border-l-4 border-green-500 font-medium'
                      : 'text-gray-700 hover:text-green-500 hover:bg-gray-50 font-light'
                  )}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
