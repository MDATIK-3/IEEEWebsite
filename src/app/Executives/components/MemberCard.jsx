"use client";
import { useState } from 'react';
import {
    Linkedin,
    Mail,
    Facebook,
    Phone,
    BookOpen,
    Calendar,
    Star,
} from "lucide-react";

const MemberCard = ({ member, isFaculty = false, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const SocialLink = ({ href, icon: Icon, label, colorClass, disabled }) => (
        <a
            href={!disabled ? href : '#'}
            className={`p-2 rounded-full ring-2 border-1 border-green-400 ring-transparent hover:ring-green transition-all duration-200 scale-100 hover:scale-110 shadow-sm hover:shadow-md ${disabled ? 'cursor-not-allowed opacity-50' : colorClass}`}
            target={!disabled && href?.startsWith('http') ? "_blank" : "_self"}
            rel={!disabled && href?.startsWith('http') ? "noopener noreferrer" : ""}
            onClick={(e) => {
                if (disabled) e.preventDefault();
                e.stopPropagation();
            }}
            aria-label={label}
            title={label}
        >
            <Icon className="w-4 h-4 text-black" strokeWidth={1.5} />
        </a>
    );

    return (
        <div
            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-transparent to-lime-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {isFaculty && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-lime-400 to-lime-600 rounded-full p-1.5 shadow-md z-10">
                    <Star className="h-3 w-3 text-white" />
                </div>
            )}

            <div className="relative z-10 p-5">
                <div className="relative mx-auto mb-4">
                    <img
                        src={member.img || "https://placehold.co/150x150/e0e0e0/505050?text=Profile"}
                        alt={member.name}
                        className={`mx-auto object-cover rounded-full shadow-md transition-all duration-500 group-hover:shadow-lg ${isFaculty ? 'h-24 w-24 ring-4 ring-lime-100 group-hover:ring-lime-200' : 'h-20 w-20 ring-4 ring-emerald-100 group-hover:ring-emerald-200'}`}
                        onError={(e) => {
                            e.target.src = "https://placehold.co/150x150/e0e0e0/505050?text=Profile";
                        }}
                    />
                </div>

                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                        {member.name}
                    </h3>
                    <p className={`text-sm font-medium ${isFaculty ? 'text-lime-600' : 'text-emerald-600'}`}>
                        {member.role}
                    </p>
                    <div className="space-y-1 mt-2 text-xs text-gray-500">
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

                <div className={`flex justify-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <SocialLink href={member.social.linkedin} icon={Linkedin} label="LinkedIn" disabled={!member.social.linkedin} />
                    <SocialLink href={`mailto:${member.social.email}`} icon={Mail} label="Email" disabled={!member.social.email} />
                    <SocialLink href={member.social.facebook} icon={Facebook} label="Facebook" disabled={!member.social.facebook} />
                </div>

            </div>
        </div>
    );
};

export default MemberCard;
