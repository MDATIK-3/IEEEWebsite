"use client";

import {
  Linkedin,
  Mail,
  Facebook,
  BookOpen,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import SocialLink from "./SocialLink";
import Image from "next/image";

const MemberCard = ({ member, isFaculty = false, onClick }) => {
  const safeSrc = member.img?.startsWith("/") ? member.img : `/${member.img}`;

  return (
    <div
      onClick={onClick}
      className="
        group relative rounded-2xl border bg-white text-gray-900 cursor-pointer
        border-gray-200 hover:border-emerald-300 hover:shadow-xl
        transition-all duration-500 overflow-hidden
        dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-emerald-500 dark:hover:shadow-xl
      "
    >
      <div
        className="
          absolute bottom-0 left-0 right-0 z-20 py-3 flex justify-center gap-3
          rounded-b-2xl shadow-md
          bg-white shadow-amber-100
          transform translate-y-full opacity-0
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-500
          dark:bg-gray-900 dark:shadow-emerald-900
        "
      >
        <SocialLink
          href={member.social.linkedin}
          icon={Linkedin}
          label="LinkedIn"
          disabled={!member.social.linkedin}
          padding="sm"
          iconSize="sm"
        />
        <SocialLink
          href={`mailto:${member.social.email}`}
          icon={Mail}
          label="Email"
          disabled={!member.social.email}
          padding="sm"
          iconSize="sm"
        />
        <SocialLink
          href={member.social.facebook}
          icon={Facebook}
          label="Facebook"
          disabled={!member.social.facebook}
          padding="sm"
          iconSize="sm"
        />
      </div>

      {isFaculty && (
        <div className="absolute top-4 right-4 z-10">
          <BadgeCheck
            className="
              h-5 w-5 text-green-600 drop-shadow
              dark:text-emerald-400
            "
          />
        </div>
      )}

      <div className="relative z-10 p-5 pt-6">
        <div className="relative mx-auto mb-4">
          <Image
            src={safeSrc}
            alt={member.name}
            width={150}
            height={150}
            className={`
              mx-auto object-cover rounded-full shadow-md transition-all duration-500
              ${
                isFaculty
                  ? "h-24 w-24 ring-4 ring-lime-100 group-hover:ring-lime-200 dark:ring-lime-700 dark:group-hover:ring-lime-500"
                  : "h-20 w-20 ring-4 ring-emerald-100 group-hover:ring-emerald-200 dark:ring-emerald-700 dark:group-hover:ring-emerald-500"
              }
            `}
          />
        </div>

        <div className="text-center">
          <h3
            className="
              text-lg font-semibold mb-1 text-gray-800 transition-colors
              group-hover:text-emerald-600
              dark:text-gray-300 dark:group-hover:text-emerald-400
            "
          >
            {member.name}
          </h3>
          <p
            className={`
              text-sm font-medium ${
                isFaculty
                  ? "text-lime-600 dark:text-lime-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }
            `}
          >
            {member.role}
          </p>
          <div className="space-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {member.department && (
              <div className="flex items-center justify-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{member.department}</span>
              </div>
            )}
            {member.year && (
              <div className="flex items-center justify-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{member.year}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
