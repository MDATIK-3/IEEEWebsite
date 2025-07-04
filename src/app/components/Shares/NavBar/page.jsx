'use client';

import { useState } from 'react';
import Logo from './components/Logo';
import DesktopNavLinks from './components/DesktopNavLinks';
import MobileNav from './components/MobileNav';
import HamburgerButton from './components/HamburgerButton';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileOpen ? 'unset' : 'hidden';
    }
    setMobileOpen(!mobileOpen);
  };

  const handleMobileLinkClick = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo onClick={handleMobileLinkClick}/>
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