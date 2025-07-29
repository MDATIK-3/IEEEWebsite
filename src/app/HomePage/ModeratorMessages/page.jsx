'use client';

import Image from 'next/image';
import { useState } from 'react';
import moderators from '@/data/moderatorsMessages.json';

export default function ModeratorMessages() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="relative py-20 flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16,185,129,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16,185,129,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Green Leadership Messages
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Insights from our sustainability leaders driving the IEEE Green University initiative
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moderators.map((moderator, index) => (
            <div
              key={moderator.id}
              className={`rounded-xl p-6 border border-transparent bg-gray-50 dark:bg-gray-800 transform duration-300 
                hover:scale-105 hover:shadow-lg hover:border-green-400/50 dark:hover:border-green-500/50 
                ${hoveredCard === moderator.id ? 'shadow-md ring-1 ring-green-200 dark:ring-green-500/40' : ''}
                ${activeCard === moderator.id ? 'ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-gray-700 shadow-lg' : ''}`
              }
              onMouseEnter={() => setHoveredCard(moderator.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveCard(activeCard === moderator.id ? null : moderator.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110 hover:brightness-110">
                  <Image
                    src={moderator.image}
                    alt={`Portrait of ${moderator.name}`}
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {moderator.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium">{moderator.title}</p>
              </div>

              <div
                className={`text-center transition-opacity duration-300 ${activeCard === moderator.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                  }`}
              >
                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{moderator.message}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
