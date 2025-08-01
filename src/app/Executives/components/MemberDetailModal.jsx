'use client';

import { useEffect } from 'react';
import {
  Linkedin,
  Mail,
  Facebook,
  Phone,
  BookOpen,
  Calendar,
  X,
  Globe,
} from 'lucide-react';

const MemberDetailModal = ({ member, onClose }) => {
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
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl shadow border bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} />
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-gray-700 hover:underline dark:text-gray-300"
        >
          {text}
        </a>
      ) : (
        <span className="break-all text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );

  const SocialLink = ({ href, icon: Icon, label, colorClass, disabled }) => (
    <a
      href={!disabled ? href : '#'}
      className={`p-4 rounded-full ring-2 border-0 ring-transparent hover:ring-green-400 transition-all duration-200 scale-100 hover:scale-110 shadow-sm hover:shadow-md ${
        disabled ? 'cursor-not-allowed opacity-50' : colorClass
      }`}
      target={!disabled && href?.startsWith('http') ? '_blank' : '_self'}
      rel={!disabled && href?.startsWith('http') ? 'noopener noreferrer' : ''}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        e.stopPropagation();
      }}
      aria-label={label}
      title={label}
    >
      <Icon className="text-black dark:text-emerald-400" strokeWidth={1.8} />
    </a>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full p-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-900 animate-fade-in transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={member.img || 'https://placehold.co/200x200/e0e0e0/505050?text=Profile'}
            alt={member.name}
            className="mb-4 h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-emerald-200 dark:ring-emerald-600"
            onError={(e) => {
              e.target.src = 'https://placehold.co/200x200/e0e0e0/505050?text=Profile';
            }}
          />
          <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-300">{member.name}</h3>
          <p className="mb-6 text-lg font-medium text-emerald-700 dark:text-emerald-400">{member.role}</p>

          <div className="max-w-xs w-full mb-6 space-y-3 text-sm">
            {member.department && (
              <InfoRow icon={BookOpen} text={member.department} colorClass="text-emerald-600 dark:text-emerald-400" />
            )}
            {member.year && (
              <InfoRow icon={Calendar} text={`Year: ${member.year}`} colorClass="text-emerald-600 dark:text-emerald-400" />
            )}
            {member.phone && (
              <InfoRow icon={Phone} href={`tel:${member.phone}`} text={member.phone} colorClass="text-emerald-600 dark:text-emerald-400" />
            )}
            {member.email && (
              <InfoRow icon={Mail} href={`mailto:${member.email}`} text={member.email} colorClass="text-red-600 dark:text-red-500" />
            )}
            {member.website && (
              <InfoRow
                icon={Globe}
                href={member.website}
                text={member.website.replace(/(^\w+:|^)\/\//, '')}
                colorClass="text-gray-600 dark:text-gray-400"
              />
            )}
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <SocialLink
              href={member.linkedin}
              icon={Linkedin}
              label="LinkedIn Profile"
              colorClass="bg-[#0A66C2] border-0 hover:bg-[#0856a8]"
              disabled={!member.linkedin}
            />
            <SocialLink
              href={member.facebook}
              icon={Facebook}
              label="Facebook Profile"
              colorClass="bg-[#1877F2] border-0 hover:bg-[#145FDB]"
              disabled={!member.facebook}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
