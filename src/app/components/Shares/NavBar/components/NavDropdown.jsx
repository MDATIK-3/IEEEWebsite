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
    isActive,
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [enableHover, setEnableHover] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeout = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = (e) => setEnableHover(e.matches);
        setEnableHover(mq.matches);
        mq.addEventListener?.('change', update);
        mq.addListener?.(update);
        return () => {
            mq.removeEventListener?.('change', update);
            mq.removeListener?.(update);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMouseEnter = () => {
        if (!enableHover) return;
        clearTimeout(hoverTimeout.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (!enableHover) return;
        hoverTimeout.current = setTimeout(() => setIsOpen(false), 200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((o) => !o);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <li
            ref={dropdownRef}
            className="relative group"
            {...(enableHover ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } : {})}
        >
            {subLinks ? (
                <>
                    <button
                        onClick={() => setIsOpen((o) => !o)}
                        onKeyDown={handleKeyDown}
                        aria-expanded={isOpen}
                        aria-controls={`dropdown-${label}`}
                        className={cx(
                            'flex items-center gap-2 w-full text-left font-medium transition-all duration-300 ease-in-out',
                            isActive ? 'text-teal-600' : 'text-gray-800 dark:text-gray-200',
                            'hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 focus:outline-none',
                            buttonClassName
                        )}
                    >
                        <span>{label}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={cx('h-5 w-5 transition-transform duration-300 ease-in-out', isOpen ? 'rotate-180' : '')}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        id={`dropdown-${label}`}
                        className={cx(
                            'transition-all duration-300 ease-in-out transform',
                            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
                            'origin-top',

                            // Mobile inline
                            'relative bg-white dark:bg-zinc-800 rounded-lg max-h-96 overflow-y-auto',

                            // Desktop floating panel
                            'md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 md:mt-2 md:min-w-64 md:rounded-xl md:shadow-2xl md:ring-1 md:ring-black/10 md:z-50 md:bg-white/95 md:dark:bg-zinc-800/95 md:backdrop-blur-sm',

                            dropdownClassName
                        )}
                    >
                        <ul className="py-2">
                            {subLinks.map(({ href, label }, index) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => {
                                            setIsOpen(false);
                                            if (onClose) onClose();
                                        }}
                                        className={cx(
                                            'block py-2 px-4 text-sm font-medium transition-colors duration-200 ',
                                            isActiveLink(pathname, href)
                                                ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/30'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30',
                                            'focus:outline-none',
                                            subLinkClassName
                                        )}
                                    >
                                        {label}
                                    </Link>
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
                        'block font-medium transition-all duration-300 ease-in-out',
                        isActive ? 'text-teal-600' : 'text-gray-800 dark:text-gray-200',
                        'hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 focus:outline-none ',
                        buttonClassName
                    )}
                >
                    {label}
                </Link>
            )}
        </li>
    );
}