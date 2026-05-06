'use client';

import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
    src: string;
    alt: string;
    isFaculty?: boolean;
    onError: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const ProfileImage: React.FC<ProfileImageProps> = ({
    src,
    alt,
    isFaculty,
    onError,
    size = 'lg'
}) => {
    const sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32'
    };

    const ringClasses = isFaculty
        ? "ring-4 ring-lime-100 dark:ring-lime-700"
        : "ring-4 ring-emerald-100 dark:ring-emerald-700";

    return (
        <div className="relative mb-6">
            <Image
                src={src}
                alt={alt}
                className={`
          mx-auto object-cover rounded-full shadow-md transition-all duration-500
          ${sizeClasses[size]} ${ringClasses}
        `}
                width={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
                height={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
                onError={onError}
                unoptimized={src.startsWith('https://placehold.co')}
            />
        </div>
    );
};

export default ProfileImage;
