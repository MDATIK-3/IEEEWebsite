'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import achievement from '@/data/acievement.json';
import BgColor from '@/app/components/BgColor';

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
            className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-zinc-700/50 overflow-hidden flex flex-col"
          >
            {/* Year Badge */}
            <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {year}
            </div>

            {/* Image Wrapper */}
            <div className="relative h-52 overflow-hidden">
              <motion.div
                className="absolute inset-0 border-2 rounded-md pointer-events-none"
                initial={{ borderColor: 'transparent' }}
                whileHover={{ borderColor: '#22c55e' }} // Tailwind green-500
                transition={{ duration: 0.3 }}
              />
              <Image
                src={image}
                alt={program_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {program_name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-base">
                {isExpanded ? details : getPreview(details)}
              </p>

              <button
                onClick={() => toggleDetails(id)}
                className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold hover:underline self-start"
              >
                {isExpanded ? 'Show less' : 'Learn more'}
              </button>
            </div>
          </div>
        );
      })}
      <BgColor />
    </div>
  );
};

export default AchieveCard;
