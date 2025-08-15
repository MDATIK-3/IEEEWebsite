'use client';

import { cx } from '@/app/utils/cx';
import Logo from './Logo';
import NavDropdown from './NavDropdown';
import { usePathname } from 'next/navigation';

export default function MobileNav({ mobileOpen, onClose, navLinks }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cx(
          'lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ease-in-out',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cx(
          'lg:hidden fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white dark:bg-zinc-900 z-50 transform transition-transform duration-200 ease-in-out shadow-xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
          <Logo onClick={onClose} />
        </div>

        <nav className="h-[calc(100vh-80px)] overflow-y-auto pb-10">
          <ul className="space-y-1 px-4 py-6">
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
                  onClose={onClose}
                  buttonClassName={cx(
                    'py-3 px-4 rounded-lg transition-all duration-200',
                    isActive && !subLinks
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-600 font-medium'
                      : isActive && subLinks
                        ? 'text-green-600 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-zinc-800 font-light'
                  )}
                  dropdownClassName=""
                  subLinkClassName="rounded-lg"
                  isActive={isActive}
                />
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}