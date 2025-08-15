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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (!enableHover) return;
        clearTimeout(hoverTimeout.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (!enableHover) return;
        hoverTimeout.current = setTimeout(() => setIsOpen(false), 140);
    };

    return (
        <li
            ref={dropdownRef}
            className="relative"
            {...(enableHover ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } : {})}
        >
            {subLinks ? (
                <>
                    <button
                        onClick={() => setIsOpen((o) => !o)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsOpen((o) => !o);
                            }
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`dropdown-${label}`}
                        className={cx(
                            'flex items-center gap-1 w-full text-left transition-colors duration-200 hover:text-green-500',
                            buttonClassName
                        )}
                    >
                        <span>{label}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={cx('h-4 w-4 transition-transform duration-200 text-gray-500', isOpen ? 'rotate-180' : '')}
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
                            'overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-in-out',
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                            'bg-white dark:bg-zinc-900 rounded-md',
                            'md:absolute md:left-0 md:mt-1 md:min-w-56 md:rounded-md md:shadow-lg md:ring-1 md:ring-black/5 md:z-50 md:bg-white md:dark:bg-zinc-800',
                            isOpen ? 'md:translate-y-0' : 'md:-translate-y-2 md:pointer-events-none',

                            dropdownClassName
                        )}
                    >
                        <ul className="py-2">
                            {subLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => {
                                            setIsOpen(false);
                                            onClose && onClose();
                                        }}
                                        className={cx(
                                            'block py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700',
                                            isActiveLink(pathname, href)
                                                ? 'text-green-600 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-green-500',
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
                        'block transition-colors duration-200 hover:text-green-500',
                        buttonClassName,
                        isActive ? 'text-green-600 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-green-500'
                    )}
                >
                    {label}
                </Link>
            )}
        </li>
    );
}
