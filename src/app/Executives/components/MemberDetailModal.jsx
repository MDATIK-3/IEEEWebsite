'use client';
import { useEffect } from 'react';
import { useTheme } from '@/app/Theme/ThemeProvider';
import {
    Linkedin,
    Mail,
    Facebook,
    Phone,
    BookOpen,
    Calendar,
    X,
    Globe
} from 'lucide-react';

const MemberDetailModal = ({ member, onClose }) => {
    const { isDark } = useTheme();

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!member) return null;

    const InfoRow = ({ icon: Icon, href, text, colorClass }) => (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl shadow border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} />
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-gray-300 hover:underline' : 'text-gray-700 hover:underline'} break-all`}>{text}</a>
            ) : (
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} break-all`}>{text}</span>
            )}
        </div>
    );

    const SocialLink = ({ href, icon: Icon, label, colorClass, disabled }) => (
        <a
            href={!disabled ? href : '#'}
            className={`p-4 rounded-full ring-2 border-0 border-green-400 ring-transparent hover:ring-green-400 transition-all duration-200 scale-100 hover:scale-110 shadow-sm hover:shadow-md ${disabled ? 'cursor-not-allowed opacity-50 ' : `${colorClass}`
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
            <Icon className={`${isDark ? 'text-emerald-400' : 'text-black'}`} strokeWidth={1.8} />
        </a>
    );

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-fade-in transition-transform transform scale-100`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className={`${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'} absolute top-4 right-4 p-2 rounded-full transition-colors`}
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <img
                        src={member.img || "https://placehold.co/200x200/e0e0e0/505050?text=Profile"}
                        alt={member.name}
                        className={`${isDark ? 'ring-emerald-600' : 'ring-emerald-200'} h-32 w-32 rounded-full object-cover mb-4 shadow-lg ring-4`}
                        onError={(e) => { e.target.src = "https://placehold.co/200x200/e0e0e0/505050?text=Profile"; }}
                    />
                    <h3 className={`${isDark ? 'text-gray-300' : 'text-gray-900'} text-2xl font-bold mb-1`}>{member.name}</h3>
                    <p className={`${isDark ? 'text-emerald-400' : 'text-emerald-700'} text-lg font-medium mb-6`}>{member.role}</p>

                    <div className="space-y-3 text-sm w-full max-w-xs mb-6">
                        {member.department && <InfoRow icon={BookOpen} text={member.department} colorClass={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
                        {member.year && <InfoRow icon={Calendar} text={`Year: ${member.year}`} colorClass={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
                        {member.phone && <InfoRow icon={Phone} href={`tel:${member.phone}`} text={member.phone} colorClass={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
                        {member.email && <InfoRow icon={Mail} href={`mailto:${member.email}`} text={member.email} colorClass={isDark ? 'text-red-500' : 'text-red-600'} />}
                        {member.website && <InfoRow icon={Globe} href={member.website} text={member.website.replace(/(^\w+:|^)\/\//, '')} colorClass={isDark ? 'text-gray-400' : 'text-gray-600'} />}
                    </div>

                    <div className="flex justify-center gap-4 mt-2 ">
                        <SocialLink href={member.linkedin} icon={Linkedin} label="LinkedIn Profile" colorClass="bg-[#0A66C2] border-0 border-green-400 hover:bg-[#0856a8]" disabled={!member.linkedin} />
                        <SocialLink href={member.facebook} icon={Facebook} label="Facebook Profile" colorClass="bg-[#1877F2] border-0 border-green-400 hover:bg-[#145FDB]" disabled={!member.facebook} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetailModal;
