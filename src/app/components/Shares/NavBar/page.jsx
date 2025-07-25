'use client';

import { useState } from 'react';
import Logo from './components/Logo';
import DesktopNavLinks from './components/DesktopNavLinks';
import MobileNav from './components/MobileNav';
import HamburgerButton from './components/HamburgerButton';
import ThemeToggleButton from '@/app/Theme/ThemeToggleButton';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/Events', label: 'Events' },
  { href: '/Executives', label: 'Executives' },
  { href: '/Gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen((prev) => !prev);
    const html = document.documentElement;
    html.classList.toggle('overflow-hidden', !mobileOpen);
  };

  const handleMobileLinkClick = () => {
    setMobileOpen(false);
    document.documentElement.classList.remove('overflow-hidden');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[56px] border-b shadow-sm backdrop-blur-xl border-gray-200/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo onClick={handleMobileLinkClick} />
          <div className="flex items-center space-x-4">
            <DesktopNavLinks navLinks={navLinks} />
            <ThemeToggleButton />
            <HamburgerButton open={mobileOpen} onClick={handleMobileMenuToggle} />
          </div>
        </div>
      </nav>

      <MobileNav navLinks={navLinks} mobileOpen={mobileOpen} onClose={handleMobileLinkClick} />
    </>
  );
}
