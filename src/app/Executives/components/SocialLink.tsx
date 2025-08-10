'use client';

import React from 'react';

interface SocialLinkProps {
    href?: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string;
    disabled: boolean;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label, disabled }) => (
    <a
        href={!disabled ? href : '#'}
        className={`
      p-3 rounded-full border shadow-md transition-all duration-200 hover:scale-110
      bg-white border-green-300
      hover:bg-emerald-600
      dark:bg-gray-800 dark:border-emerald-600
      dark:hover:bg-emerald-700
      ${disabled ? 'cursor-not-allowed opacity-50 hover:scale-100 hover:bg-white dark:hover:bg-gray-800' : ''}
    `}
        target={!disabled && href?.startsWith('http') ? '_blank' : '_self'}
        rel={!disabled && href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={(e) => {
            if (disabled) {
                e.preventDefault();
            }
            e.stopPropagation();
        }}
        aria-label={label}
        title={label}
    >
        <Icon
            className="w-5 h-5 transition-colors text-emerald-700 dark:text-emerald-400"
            strokeWidth={1.5}
        />
    </a>
);

export default SocialLink;
