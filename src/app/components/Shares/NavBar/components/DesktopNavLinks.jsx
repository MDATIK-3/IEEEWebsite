'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cx } from '@/app/utils/cx';
import { isActiveLink } from '@/app/utils/navUtils';

export default function DesktopNavLinks({ navLinks, activityLinks }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {/* First Link: Home */}
      <li key={navLinks[0].href}>
        <Link
          href={navLinks[0].href}
          className={cx(
            isActiveLink(pathname, navLinks[0].href)
              ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide'
              : 'font-light tracking-wide text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300'
          )}
        >
          {navLinks[0].label}
        </Link>
      </li>

      {/* Activities Dropdown */}
      <li
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          className={cx(
            activityLinks.some(link => isActiveLink(pathname, link.href))
              ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide'
              : 'font-light tracking-wide text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300'
          )}
        >
          Activities
        </button>

        {/* Dropdown Menu with spacer and dividers */}
        <div
          className={cx(
            'absolute top-full left-0 w-44 bg-transparent z-50 transition-opacity duration-200',
            hovered ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          )}
        >
          {/* Transparent spacer to bridge the gap */}
          <div className="h-2 bg-transparent w-full" />
          
          <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-md py-0 overflow-hidden">
            {activityLinks.map(({ href, label }, index) => (
              <div key={href}>
                <Link
                  href={href}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-200"
                >
                  {label}
                </Link>
                {/* Add divider between options */}
                {index < activityLinks.length - 1 && (
                  <hr className="border-gray-200 dark:border-gray-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </li>

      {/* Remaining nav links */}
      {navLinks.slice(1).map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={cx(
              isActiveLink(pathname, href)
                ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide'
                : 'font-light tracking-wide text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300'
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}