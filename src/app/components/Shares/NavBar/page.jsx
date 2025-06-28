'use client';

import { useEffect, useState } from 'react';
import Logo from './components/Logo';
import DesktopNavLinks from './components/DesktopNavLinks';
import MobileNav from './components/MobileNav';
import HamburgerButton from './components/HamburgerButton';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleMobileMenuToggle = () => setMobileOpen(!mobileOpen);
  const handleMobileLinkClick = () => setMobileOpen(false);

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo />
          <div className="flex items-center space-x-4">
            <DesktopNavLinks />
            <HamburgerButton open={mobileOpen} onClick={handleMobileMenuToggle} />
          </div>
        </div>
      </nav>

      <MobileNav mobileOpen={mobileOpen} onClose={handleMobileLinkClick} />
    </>
  );
}
