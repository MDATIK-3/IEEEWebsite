'use client';

import { useEffect, useState } from 'react';
import Logo from './components/Logo';
import DesktopNavLinks from './components/DesktopNavLinks';
import MobileNav from './components/MobileNav';
import HamburgerButton from './components/HamburgerButton';
import ThemeToggleButton from '@/app/Theme/ThemeToggleButton';
import useMounted from '@/app/hooks/useMounted';

// Main navigation links (excluding Events & Achievements)
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/Executives', label: 'Executives' },
  { href: '/Gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

// Dropdown activity links (go under "Activities")
const activityLinks = [
  { href: '/Events', label: 'Events' },
  { href: '/Achivement', label: 'Achievements' },
];

export default function Navbar() {
  const mounted = useMounted();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent scrolling when mobile nav is open
  useEffect(() => {
    const html = document.documentElement;
    if (mobileOpen) {
      html.classList.add('overflow-hidden');
    } else {
      html.classList.remove('overflow-hidden');
    }

    return () => html.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  const handleMobileMenuToggle = () => setMobileOpen(prev => !prev);
  const handleMobileLinkClick = () => setMobileOpen(false);

  // Return nothing if the component is not mounted (to avoid hydration mismatch)
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] border-b shadow-sm backdrop-blur-xl border-gray-200/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo />
          <div className="flex items-center space-x-4">
            <DesktopNavLinks navLinks={navLinks} activityLinks={activityLinks} />
            <ThemeToggleButton />
            <div className="lg:hidden p-2 w-10 h-10" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] border-b shadow-sm backdrop-blur-xl border-gray-200/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:px-6 lg:py-2.5">
          <Logo onClick={handleMobileLinkClick} />
          <div className="flex items-center space-x-4">
            <DesktopNavLinks navLinks={navLinks} activityLinks={activityLinks} />
            <ThemeToggleButton />
            <HamburgerButton open={mobileOpen} onClick={handleMobileMenuToggle} />
          </div>
        </div>
      </nav>

      <MobileNav
        navLinks={navLinks}
        activityLinks={activityLinks}
        mobileOpen={mobileOpen}
        onClose={handleMobileLinkClick}
      />
    </>
  );
}