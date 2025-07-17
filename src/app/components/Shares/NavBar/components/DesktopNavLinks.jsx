'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import { isActiveLink } from '@/app/utils/navUtils';

export default function DesktopNavLinks({navLinks}) {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={cx(
              isActiveLink(pathname, href)
                ? 'text-green-500 border-b-2 border-green-500 font-medium tracking-wide dark:text-green-400 dark:border-green-400'
                : 'font-light tracking-wide text-gray-700 hover:text-green-500 focus:outline-none focus:text-green-500 transition-all duration-300 ease-out dark:text-white dark:hover:text-green-400 dark:focus:text-green-400'
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}