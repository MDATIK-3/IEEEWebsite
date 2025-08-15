'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cx } from '@/app/utils/cx';
import { isActiveLink } from '@/app/utils/navUtils';

export default function NavDropdown({
    label,
    href,
    subLinks,
    onClose,
    buttonClassName,
    dropdownClassName,
    subLinkClassName,
    isActive
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <li ref={dropdownRef} className="relative">
            {subLinks ? (
                <>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsOpen(!isOpen);
                            }
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`dropdown-${label}`}
                        className={cx(
                            'flex items-center justify-between w-full text-left transition-colors duration-200',
                            buttonClassName
                        )}
                    >
                        <span>{label}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={cx(
                                'h-5 w-5 text-gray-400 transition-transform duration-200',
                                isOpen ? 'rotate-180' : ''
                            )}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div
                        id={`dropdown-${label}`}
                        className={cx(
                            'overflow-hidden transition-all duration-300 ease-in-out',
                            isOpen
                                ? 'max-h-40 opacity-100 visible'
                                : 'max-h-0 opacity-0 invisible pointer-events-none',
                            dropdownClassName
                        )}
                    >
                        <ul className={cx('space-y-1 pl-2', isOpen ? 'mt-1' : '')}>
                            {subLinks.map(({ href, label }, index) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => {
                                            setIsOpen(false);
                                            if (onClose) onClose();
                                        }}
                                        className={cx(
                                            'block py-2 px-4 rounded-md transition-colors duration-200',
                                            isActiveLink(pathname, href)
                                                ? 'text-green-600 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-green-500',
                                            subLinkClassName
                                        )}
                                    >
                                        {label}
                                    </Link>
                                    {index < subLinks.length - 1 && (
                                        <hr className="border-gray-200 dark:border-zinc-700 mx-4" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <Link
                    href={href}
                    onClick={onClose}
                    className={cx(
                        'block transition-colors duration-200',
                        buttonClassName,
                        isActive
                            ? 'text-green-600 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:text-green-500'
                    )}
                >
                    {label}
                </Link>
            )}
        </li>
    );
}
