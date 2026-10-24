'use client';
import Image from 'next/image';
import { useState } from 'react';
import { resolveImageSrc } from '@/app/utils/imageSrc';
import RichText from '@/app/_components/RichText';

const SpeakerSection = ({ event }) => {
    const [expanded, setExpanded] = useState({});

    if (!event.speakers || event.speakers.length === 0) return null;

    const toggleExpand = (index) => {
        setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const formatSrc = (src) => resolveImageSrc(src);

    // Bio and role come from the speaker object (admin-managed, DB-driven). Older
    // rows stored only two bios in guest_bio / special_guest_bio, so fall back to
    // those by position to keep existing events rendering unchanged.
    const bioFor = (speaker, index) =>
        speaker?.bio ||
        (index === 0 ? event.guestBio : index === 1 ? event.specialGuestBio : '') ||
        '';
    const roleFor = (speaker, index) =>
        speaker?.designation || speaker?.role || (index === 0 ? 'Main Speaker' : 'Special Guest');

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100 dark:border-green-800 max-w-4xl mx-auto transition-colors duration-300">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 text-center sm:text-left">
                Featured Speakers
            </h2>

            <div className="space-y-6 sm:space-y-8">
                {event.speakers.map((speaker, index) => {
                    const bio = bioFor(speaker, index);
                    // Length of the readable text (tags stripped) decides whether the
                    // bio needs a Read more / Show less toggle.
                    const plain = bio.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    const isExpanded = expanded[index] || false;

                    return (
                        <div
                            key={index}
                            className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 ${index !== 0
                                    ? 'pt-6 sm:pt-6 border-t border-gray-100 dark:border-slate-700'
                                    : ''
                                }`}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-400 dark:border-green-500 transition-colors duration-300">
                                <Image
                                    src={formatSrc(speaker.image)}
                                    alt={speaker.name}
                                    width={80}
                                    height={80}
                                    sizes="80px"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 mb-1 transition-colors duration-300">
                                    {speaker.name}
                                </h3>
                                <p className="text-green-600 dark:text-green-400 font-medium mb-3 text-sm sm:text-base transition-colors duration-300">
                                    {roleFor(speaker, index)}
                                </p>

                                <div
                                    className={`transition-all duration-300 ${isExpanded ? '' : 'max-h-24 overflow-hidden'
                                        }`}
                                >
                                    <RichText
                                        html={bio}
                                        className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                                    />
                                </div>

                                {plain.length > 150 && (
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 text-green-700 dark:text-green-300 font-medium text-sm rounded-md transition-all duration-200 hover:shadow-sm border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 dark:focus:ring-green-400"
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? (
                                            <>
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 15l7-7 7 7"
                                                    />
                                                </svg>
                                                Show Less
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                                Read More
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpeakerSection;
