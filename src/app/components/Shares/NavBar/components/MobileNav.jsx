'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/app/utils/cx';
import Image from 'next/image';

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
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <div
                className={cx(
                    'lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transition-transform duration-300 ease-in-out',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                    <Link href="/" onClick={onClose}>
                        <Image
                            src="/images/IEEE_SB.png"
                            alt="IEEE SB Logo"
                            width={100}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-4 py-6">
                    <ul className="space-y-4">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={onClose}
                                    className={cx(
                                        'block text-lg py-3 px-4 rounded-lg transition-all duration-200',
                                        pathname === href
                                            ? 'text-green-500 bg-green-50 border-l-4 border-green-500 font-medium'
                                            : 'text-gray-700 hover:text-green-500 hover:bg-gray-50 font-light'
                                    )}
                                    aria-current={pathname === href ? 'page' : undefined}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
