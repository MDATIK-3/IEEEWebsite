'use client';

import React from 'react';

interface SocialLinkProps {
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  disabled: boolean;
  colorClass?: string;
  padding?: 'sm' | 'md';
  iconSize?: 'sm' | 'md'; 
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon: Icon,
  label,
  disabled,
  colorClass = 'bg-white border-green-300 hover:bg-emerald-600 dark:bg-gray-800 dark:border-emerald-600 dark:hover:bg-emerald-700',
  padding = 'md',
  iconSize = 'md',
}) => {
  const paddingClass = padding === 'sm' ? 'p-2' : 'p-3';
  const iconSizeClass = iconSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <a
      href={!disabled ? href : '#'}
      className={`
        ${paddingClass} rounded-full border shadow-md transition-all duration-200 hover:scale-110
        ${colorClass}
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
        className={`${iconSizeClass} transition-colors text-emerald-700 dark:text-emerald-400`}
        strokeWidth={1.5}
      />
    </a>
  );
};

export default SocialLink;