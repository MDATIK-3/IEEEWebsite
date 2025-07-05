'use client';
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
    const safeSrc = member.img?.startsWith('/') ? member.img : `/${member.img}`;

    return (
        <div
            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-white shadow-amber-100 py-3 flex justify-center gap-3 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-2xl shadow-md">
                <SocialLink href={member.social.linkedin} icon={Linkedin} label="LinkedIn" disabled={!member.social.linkedin} />
                <SocialLink href={`mailto:${member.social.email}`} icon={Mail} label="Email" disabled={!member.social.email} />
                <SocialLink href={member.social.facebook} icon={Facebook} label="Facebook" disabled={!member.social.facebook} />
            </div>


            {isFaculty && (
                <div className="absolute top-4 right-4 z-10">
                    <BadgeCheck className="h-5 w-5 text-green-600 drop-shadow" />
                </div>
            )}

            <div className="relative z-10 p-5 pt-6">
                <div className="relative mx-auto mb-4">
                    <Image
                        src={safeSrc}
                        alt={member.name}
                        width={150}
                        height={150}
                        className={`mx-auto object-cover rounded-full shadow-md transition-all duration-500 ${isFaculty
                            ? 'h-24 w-24 ring-4 ring-lime-100 group-hover:ring-lime-200'
                            : 'h-20 w-20 ring-4 ring-emerald-100 group-hover:ring-emerald-200'
                            }`}
                    />
                </div>

                <div className="text-center">
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
            </div>
        </div>
    );
};

export default MemberCard;
