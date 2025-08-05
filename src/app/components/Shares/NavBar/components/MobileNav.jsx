'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cx } from '@/app/utils/cx';
import { isActiveLink } from '@/app/utils/navUtils';
import Logo from './Logo';

export default function MobileNav({ mobileOpen, onClose, navLinks, activityLinks }) {
  const pathname = usePathname();
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close activities dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActivitiesOpen(false);
      }
    };

    if (activitiesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activitiesOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cx(
          'lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside
        className={cx(
          'lg:hidden fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white dark:bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out shadow-xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
          <Logo onClick={onClose} />
        </div>

        {/* Navigation List */}
        <nav className="h-[calc(100vh-80px)] overflow-y-auto pb-10">
          <ul className="space-y-1 px-4 py-6">
            {/* Home Link */}
            <li key={navLinks[0].href}>
              <Link
                href={navLinks[0].href}
                onClick={onClose}
                className={cx(
                  'flex items-center py-3 px-4 rounded-lg transition-all duration-200',
                  isActiveLink(pathname, navLinks[0].href)
                    ? 'text-green-600 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-600 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-zinc-800 font-light'
                )}
              >
                {navLinks[0].label}
              </Link>
            </li>

            {/* Activities Dropdown */}
            <li ref={dropdownRef}>
              <button
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                className="flex justify-between w-full text-left py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200"
              >
                <span className="font-light">Activities</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={cx(
                    'h-5 w-5 text-gray-400 transition-transform duration-200',
                    activitiesOpen ? 'rotate-180' : ''
                  )} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div
                className={cx(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  activitiesOpen ? 'max-h-40' : 'max-h-0'
                )}
              >
                <ul className="pl-4 mt-1 space-y-1 border-l border-gray-200 dark:border-zinc-700 ml-4">
                  {activityLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className={cx(
                          'block py-2.5 px-4 rounded-lg transition-all',
                          isActiveLink(pathname, href)
                            ? 'text-green-600 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Remaining navLinks */}
            {navLinks.slice(1).map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cx(
                    'flex items-center py-3 px-4 rounded-lg transition-all duration-200',
                    isActiveLink(pathname, href)
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-600 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-zinc-800 font-light'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
