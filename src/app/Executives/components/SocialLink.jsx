'use client';

const SocialLink = ({ href, icon: Icon, label, disabled }) => {
  return (
    <a
      href={!disabled ? href : '#'}
      className={`
        p-2 rounded-full border shadow-md transition-all duration-200 hover:scale-110
        bg-white border-green-300
        hover:bg-emerald-600
        dark:bg-gray-800 dark:border-emerald-600
        dark:hover:bg-emerald-700
        ${disabled ? 'cursor-not-allowed opacity-50 hover:scale-100 hover:bg-none dark:hover:bg-none' : ''}
      `}
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
        className="w-4 h-4 transition-colors text-emerald-700 dark:text-emerald-400"
        strokeWidth={1.5}
      />
    </a>
  );
};

export default SocialLink;
