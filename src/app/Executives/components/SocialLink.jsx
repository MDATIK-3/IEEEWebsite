'use client';
import { useTheme } from '@/app/Theme/ThemeProvider';

const SocialLink = ({ href, icon: Icon, label, disabled }) => {
  const { isDark } = useTheme();

  return (
    <a
      href={!disabled ? href : '#'}
      className={`p-2 rounded-full border shadow-md transition-all duration-200 hover:scale-110 ${
        isDark
          ? `bg-gray-800 border-emerald-600 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-emerald-700'}`
          : `bg-white border-green-300 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`
      }`}
      target={!disabled && href?.startsWith('http') ? "_blank" : "_self"}
      rel={!disabled && href?.startsWith('http') ? "noopener noreferrer" : ""}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        e.stopPropagation();
      }}
      aria-label={label}
      title={label}
    >
      <Icon
        className={`w-4 h-4 transition-colors ${
          isDark ? 'text-emerald-400' : 'text-emerald-700'
        }`}
        strokeWidth={1.5}
      />
    </a>
  );
};

export default SocialLink;
