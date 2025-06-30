'use client';

import Image from 'next/image';
import { useState } from 'react';

const moderators = [
  {
    id: 1,
    name: "Dr. Ahmed Al Mansur",
    title: "Head of Sustainability",
    image: "/images/AHMED.jpg",
    message:
      "IEEE Green University represents our commitment to sustainable education. Through innovative programs, we're training the next generation of eco-conscious engineers who will lead the green revolution.",
  },
  {
    id: 2,
    name: "Prof. Rajibul Palash",
    title: "IEEE Green University Mentor",
    image: "/images/RJBUL.jpg",
    message:
      "Our green initiatives go beyond campus boundaries. We're creating a model for sustainable university operations that reduces carbon footprint while enhancing learning experiences.",
  },
  {
    id: 3,
    name: "Eng. Montaser Quader",
    title: "Dr. Muhammad Aminur Rahaman",
    image: "/images/AMN.jpg",
    message:
      "At IEEE Green University, we combine technical education with environmental stewardship. Our students develop solutions that address real-world sustainability challenges.",
  },
];

export default function ModeratorMessages() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="relative py-16 px-4 bg-white min-h-screen overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Green Leadership Messages
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Insights from our sustainability leaders driving the IEEE Green University initiative
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moderators.map((moderator, index) => (
            <div
              key={moderator.id}
              className={`bg-gray-50 rounded-xl p-6 border border-transparent transform duration-300 hover:scale-105 hover:shadow-lg hover:border-1 hover:border-green-400/50 ${hoveredCard === moderator.id ? 'shadow-md ring-1 ring-green-200' : ''
                } ${activeCard === moderator.id ? 'ring-2 ring-green-500 bg-green-50 shadow-lg' : ''
                }`}
              onMouseEnter={() => setHoveredCard(moderator.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveCard(activeCard === moderator.id ? null : moderator.id)}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110 hover:brightness-110">
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
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {moderator.name}
                </h3>
                <p className="text-green-600 font-medium">{moderator.title}</p>
              </div>

              <div
                className={`text-center transition-opacity duration-300 ${activeCard === moderator.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                  }`}
              >
                <blockquote className="text-gray-700 leading-relaxed">
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
