'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface FacultyBadgeProps {
    isFaculty?: boolean;
    size?: 'sm' | 'md' | 'lg';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const FacultyBadge: React.FC<FacultyBadgeProps> = ({
    isFaculty,
    size = 'md',
    position = 'top-left'
}) => {
    if (!isFaculty) return null;

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    };

    return (
        <div className={`absolute ${positionClasses[position]} z-10`}>
            <BadgeCheck className={`${sizeClasses[size]} text-green-600 drop-shadow dark:text-emerald-400`} />
        </div>
    );
};

export default FacultyBadge;
