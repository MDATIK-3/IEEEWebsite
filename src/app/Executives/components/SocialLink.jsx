const SocialLink = ({ href, icon: Icon, label, disabled }) => (
    <a
        href={!disabled ? href : '#'}
        className={`p-2 bg-white rounded-full border border-green-300 shadow-md transition-all duration-200 hover:scale-110 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        target={!disabled && href?.startsWith('http') ? "_blank" : "_self"}
        rel={!disabled && href?.startsWith('http') ? "noopener noreferrer" : ""}
        onClick={(e) => {
            if (disabled) e.preventDefault();
            e.stopPropagation();
        }}
        aria-label={label}
        title={label}
    >
        <Icon className="w-4 h-4 text-emerald-700" strokeWidth={1.5} />
    </a>
);

export default SocialLink;