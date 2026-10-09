'use client';

import { usePathname } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import NavDropdown from './NavDropdown';

export default function DesktopNavLinks({ navLinks }) {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {navLinks.map(({ href, label, subLinks }) => {
        const isActive = subLinks
          ? subLinks.some(link => link.href === pathname)
          : href === pathname;

        return (
          <NavDropdown
            key={href || label}
            label={label}
            href={href}
            subLinks={subLinks}
            buttonClassName={cx(
              'tracking-wide',
              isActive
                ? 'text-green-500 border-b-2 border-green-500 font-medium'
                : 'font-light text-gray-700 dark:text-gray-300 hover:text-green-500 transition-all duration-300'
            )}
            dropdownClassName="absolute top-full left-0 z-50"
            subLinkClassName="text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-200"
            isActive={isActive}
          />
        );
      })}
    </ul>
  );
}