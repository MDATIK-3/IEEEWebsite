'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import Logo from './Logo';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/Events', label: 'Events' },
    { href: '/Executives', label: 'Executives' },
    { href: '/Gallery', label: 'Gallery' },
];

export default function MobileNav({ mobileOpen, onClose }) {
    const pathname = usePathname();

    return (
        <>
            <div
                className={cx(
                    'lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={cx(
                    'lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ease-in-out',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                    <Logo onClick={onClose} />

                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="relative w-6 h-6 focus:outline-none group"
                    >
                        <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-700 transform rotate-45 group-hover:bg-green-500" />
                        <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-700 transform -rotate-45 group-hover:bg-green-500" />
                    </button>
                </div>

                <nav className="px-4 py-6">
                    <ul className="space-y-4">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={onClose}
                                    className={cx(
                                        'block text-lg py-3 px-4 rounded-lg transition-all duration-200',
                                        pathname === href
                                            ? 'text-green-600 bg-green-50 border-l-4 border-green-600 font-medium'
                                            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 font-light'
                                    )}
                                    aria-current={pathname === href ? 'page' : undefined}
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