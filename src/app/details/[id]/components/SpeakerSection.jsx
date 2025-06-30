'use client';
import Image from 'next/image';
import { useState } from 'react';

const SpeakerSection = ({ event }) => {
  if (!event.speakers || event.speakers.length === 0) return null;

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">Featured Speakers</h2>

      <div className="space-y-6 sm:space-y-8">
        {event.speakers.map((speaker, index) => {
          const bio = index === 0 ? event.guestBio : event.specialGuestBio;
          const isExpanded = expanded[index] || false;

          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 ${
                index !== 0 ? 'pt-6 sm:pt-6 border-t border-gray-100' : ''
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-400">
                <Image
                  src={`/${speaker.image}`}
                  alt={speaker.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{speaker.name}</h3>
                <p className="text-green-600 font-medium mb-3 text-sm sm:text-base">
                  {index === 0 ? 'Main Speaker' : 'Special Guest'}
                </p>

                <p
                  className={`text-gray-600 leading-relaxed transition-all duration-300 text-sm sm:text-base ${
                    isExpanded ? '' : 'line-clamp-3 sm:line-clamp-2'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {bio}
                </p>

                {bio && bio.length > 150 && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm rounded-md transition-all duration-200 hover:shadow-sm border border-green-200 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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