'use client';
import { useTheme } from '@/app/Theme/ThemeProvider';
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
    const { isDark } = useTheme();
    const safeSrc = member.img?.startsWith('/') ? member.img : `/${member.img}`;

    const containerClass = isDark
        ? "group relative bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500 hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer"
        : "group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer";

    const socialContainerClass = isDark
        ? "absolute bottom-0 left-0 right-0 z-20 bg-gray-900 shadow-emerald-900 py-3 flex justify-center gap-3 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-2xl shadow-md"
        : "absolute bottom-0 left-0 right-0 z-20 bg-white shadow-amber-100 py-3 flex justify-center gap-3 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-2xl shadow-md";

    const badgeClass = isDark
        ? "h-5 w-5 text-emerald-400 drop-shadow"
        : "h-5 w-5 text-green-600 drop-shadow";

    const nameClass = isDark
        ? "text-lg font-semibold text-gray-300 mb-1 group-hover:text-emerald-400 transition-colors"
        : "text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors";

    const roleClass = isFaculty
        ? isDark
            ? "text-lime-400"
            : "text-lime-600"
        : isDark
            ? "text-emerald-400"
            : "text-emerald-600";

    const infoTextClass = isDark
        ? "space-y-1 mt-2 text-xs text-gray-400"
        : "space-y-1 mt-2 text-xs text-gray-500";

    const imageRingClass = isFaculty
        ? isDark
            ? "h-24 w-24 ring-4 ring-lime-700 group-hover:ring-lime-500"
            : "h-24 w-24 ring-4 ring-lime-100 group-hover:ring-lime-200"
        : isDark
            ? "h-20 w-20 ring-4 ring-emerald-700 group-hover:ring-emerald-500"
            : "h-20 w-20 ring-4 ring-emerald-100 group-hover:ring-emerald-200";

    return (
        <div className={containerClass} onClick={onClick}>
            <div className={socialContainerClass}>
                <SocialLink href={member.social.linkedin} icon={Linkedin} label="LinkedIn" disabled={!member.social.linkedin} />
                <SocialLink href={`mailto:${member.social.email}`} icon={Mail} label="Email" disabled={!member.social.email} />
                <SocialLink href={member.social.facebook} icon={Facebook} label="Facebook" disabled={!member.social.facebook} />
            </div>

            {isFaculty && (
                <div className="absolute top-4 right-4 z-10">
                    <BadgeCheck className={badgeClass} />
                </div>
            )}

            <div className="relative z-10 p-5 pt-6">
                <div className="relative mx-auto mb-4">
                    <Image
                        src={safeSrc}
                        alt={member.name}
                        width={150}
                        height={150}
                        className={`mx-auto object-cover rounded-full shadow-md transition-all duration-500 ${imageRingClass}`}
                    />
                </div>

                <div className="text-center">
                    <h3 className={nameClass}>
                        {member.name}
                    </h3>
                    <p className={`text-sm font-medium ${roleClass}`}>
                        {member.role}
                    </p>
                    <div className={infoTextClass}>
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
