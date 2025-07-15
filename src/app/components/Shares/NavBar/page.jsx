'use client';

import { useState, useContext } from 'react';
import Logo from './components/Logo';
import DesktopNavLinks from './components/DesktopNavLinks';
import MobileNav from './components/MobileNav';
import HamburgerButton from './components/HamburgerButton';
import ThemeToggleButton from '../../Theme/ThemeToggleButton';
import { ThemeContext } from '../../Theme/ThemeProvider';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  console.log('Current theme:', theme);

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
      <nav
        key={theme}
        className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo onClick={handleMobileLinkClick} />
          <div className="flex items-center space-x-4">
            <DesktopNavLinks />
            <ThemeToggleButton />
            <HamburgerButton open={mobileOpen} onClick={handleMobileMenuToggle} />
          </div>
        </div>
      </nav>

      <MobileNav mobileOpen={mobileOpen} onClose={handleMobileLinkClick} />
    </>
  );
}
