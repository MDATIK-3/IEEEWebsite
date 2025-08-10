'use client';

import { useEffect, useState } from 'react';
import {
  Linkedin,
  Mail,
  Facebook,
  X,
} from 'lucide-react';
import SocialLink from './SocialLink';
import ProfileImage from './ProfileImage';
import FacultyBadge from './FacultyBadge';
import { MemberDetailModalProps } from './types';

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  const [imgSrc, setImgSrc] = useState<string>('https://placehold.co/200x200/e0e0e0/505050?text=Profile');

  useEffect(() => {
    if (member?.img) {
      const imagePath = member.img.startsWith('/') ? member.img : `/${member.img}`;
      setImgSrc(imagePath);
    } else {
      setImgSrc('https://placehold.co/200x200/e0e0e0/505050?text=Profile');
    }
  }, [member]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!member) return null;

  const cleanedEmail = member.social?.email?.startsWith('mailto:')
    ? member.social.email.replace('mailto:', '')
    : member.social?.email;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
    >
      <div
        className="relative max-w-lg w-full p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 animate-fade-in transition-all duration-300 transform scale-100 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <FacultyBadge isFaculty={member.isFaculty} />

          <ProfileImage
            src={imgSrc}
            alt={`${member.name}'s profile picture`}
            isFaculty={member.isFaculty}
            onError={() => {
              setImgSrc('https://placehold.co/200x200/e0e0e0/505050?text=Profile');
            }}
          />

          <h3
            id="member-modal-title"
            className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-300"
          >
            {member.name}
          </h3>

          <p
            className={`mb-6 text-lg font-medium ${member.isFaculty
                ? "text-lime-600 dark:text-lime-400"
                : "text-emerald-600 dark:text-emerald-400"
              }`}
          >
            {member.role}
          </p>

          <div className="flex justify-center gap-4 mt-4">
            <SocialLink
              href={member.social?.linkedin}
              icon={Linkedin}
              label="LinkedIn Profile"
              disabled={!member.social?.linkedin}
            />
            <SocialLink
              href={member.social?.facebook}
              icon={Facebook}
              label="Facebook Profile"
              disabled={!member.social?.facebook}
            />
            <SocialLink
              href={cleanedEmail ? `mailto:${cleanedEmail}` : undefined}
              icon={Mail}
              label="Email"
              disabled={!cleanedEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
