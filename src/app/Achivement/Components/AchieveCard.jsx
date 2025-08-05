'use client';
import Image from 'next/image';
import { useState } from 'react';
import achievement from '@/data/acievement.json';

const AchieveCard = () => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleDetails = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getPreview = (text) => {
    const words = text.split(' ');
    return words.slice(0, 9).join(' ') + (words.length > 9 ? '...' : '');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-8 max-w-7xl mx-auto items-start">
      {achievement.map(({ id, year, program_name, details, image }) => {
        const isExpanded = expandedCards[id];

        return (
          <div
            key={id}
            className="group relative bg-white dark:bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-zinc-700/60 transform hover:-translate-y-1 flex flex-col"
          >
            {/* Year badge */}
            <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {year}
            </div>

            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-80"></div>
              <Image
                src={image}
                alt={program_name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5 pt-3 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {program_name}
              </h3>

              <div className="flex items-center mb-3">
                <div className="w-8 h-0.5 bg-gray-800 dark:bg-green-500 mr-2" />
                <div className="w-4 h-0.5 bg-gray-600 dark:bg-green-500" />
              </div>

              {/* Expandable Text */}
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {isExpanded ? details : getPreview(details)}
              </p>

              {/* Toggle Button */}
              <div className="mt-4">
                <button
                  onClick={() => toggleDetails(id)}
                  className="text-gray-800 dark:text-green-400 font-medium text-sm flex items-center group-hover:text-black dark:group-hover:text-green-300 transition-colors"
                >
                  {isExpanded ? 'Show less' : 'Learn more'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchieveCard;
