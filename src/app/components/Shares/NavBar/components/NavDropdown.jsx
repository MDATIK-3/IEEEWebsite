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
    const hoverTimeout = useRef(null);
    const containerRef = useRef(null);

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

    const handleMouseEnter = () => {
        if (!enableHover) return;
        clearTimeout(hoverTimeout.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (!enableHover) return;
        hoverTimeout.current = setTimeout(() => setIsOpen(false), 200);
    };

    const handleClick = () => setIsOpen((o) => !o);

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
            ref={containerRef}
            className="relative"
            onMouseEnter={enableHover ? handleMouseEnter : undefined}
            onMouseLeave={enableHover ? handleMouseLeave : undefined}
        >
            {subLinks ? (
                <>
                    <button
                        onClick={handleClick}
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
                            'transition-all duration-300 ease-in-out transform origin-top',
                            isOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-2',
                            'absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-64 rounded-xl shadow-2xl ring-1 ring-black/10 z-50 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm',
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
                                            onClose?.();
                                        }}
                                        className={cx(
                                            'block py-2 px-4 text-sm font-medium transition-colors duration-200 focus:outline-none',
                                            isActiveLink(pathname, href)
                                                ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/30'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30',
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
                        'hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 focus:outline-none',
                        buttonClassName
                    )}
                >
                    {label}
                </Link>
            )}
        </li>
    );
}
