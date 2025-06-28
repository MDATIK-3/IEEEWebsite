'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/app/utils/cx';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/Events', label: 'Events' },
  { href: '/Executives', label: 'Executives' },
  { href: '/Gallery', label: 'Gallery' },
];

export default function DesktopNavLinks() {
  const pathname = usePathname();

  const activeLinkClasses =
    'text-green-500 border-b-2 border-green-500 font-medium tracking-wide';
  const defaultLinkClasses =
    'font-light tracking-wide text-gray-700 hover:text-green-500 focus:outline-none focus:text-green-500 transition-all duration-300 ease-out';

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={cx(
              pathname === href ? activeLinkClasses : defaultLinkClasses
            )}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
