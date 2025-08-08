'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cx } from '@/app/utils/cx';
import { isActiveLink } from '@/app/utils/navUtils';

export default function DesktopNavLinks({ navLinks }) {
  const pathname = usePathname();
  const [hoveredLabel, setHoveredLabel] = useState(null);

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {navLinks.map(({ href, label, subLinks }) => {
        const isHovered = hoveredLabel === label;
        const isActive = subLinks
          ? subLinks.some(link => isActiveLink(pathname, link.href))
          : isActiveLink(pathname, href);

        return (
          <li
            key={href || label}
            className="relative"
            onMouseEnter={() => subLinks && setHoveredLabel(label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            {subLinks ? (
              <>
                <div
                  className={cx(
                    isActive
                      ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide'
                      : 'font-light tracking-wide text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300',
                    'cursor-pointer'
                  )}
                >
                  {label}
                </div>
                <div
                  className={cx(
                    'absolute top-full left-0 w-44 bg-transparent z-50 transition-opacity duration-200',
                    isHovered ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  )}
                >
                  <div className="h-2 bg-transparent w-full" />
                  <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-md overflow-hidden">
                    {subLinks.map(({ href, label }, index) => (
                      <div key={href}>
                        <Link
                          href={href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-200"
                        >
                          {label}
                        </Link>
                        {index < subLinks.length - 1 && (
                          <hr className="border-gray-200 dark:border-gray-700 mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={href}
                className={cx(
                  isActive
                    ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide'
                    : 'font-light tracking-wide text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300'
                )}
              >
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
