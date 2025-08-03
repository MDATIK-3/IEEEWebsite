'use client';

import Image from 'next/image';
import { useState } from 'react';
import moderators from '@/data/moderatorsMessages.json';
import ShimmerEffect from '@/app/components/ShimmerEffect';

export default function ModeratorMessages() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const chairperson = moderators.find(mod => mod.id === 3);
  const director = moderators.find(mod => mod.id === 1);
  const lecturers = moderators.filter(mod => mod.id !== 1 && mod.id !== 3);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">

          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-900/30">
            Leadership Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
            Green University Visionaries
          </h1>
          <div className="h-1 w-24 bg-green-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Perspectives from our academic leaders driving sustainable innovation
          </p>
        </div>

        {/* Chairperson */}
        <div className="flex justify-center mb-20">


          <div
            className={`group w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-md border border-gray-200 dark:border-gray-700
              transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1
              ${hoveredCard === chairperson.id ? 'scale-[1.02]' : ''}
              ${activeCard === chairperson.id ? 'ring-2 ring-green-500 bg-green-50 dark:bg-gray-700' : ''}`}
            onMouseEnter={() => setHoveredCard(chairperson.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveCard(activeCard === chairperson.id ? null : chairperson.id)}
          >

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-[6px] border-green-400 dark:border-green-600 shadow-lg ring-4 ring-green-200/30 dark:ring-green-900/30">
                  <Image
                    src={chairperson.image}
                    alt={`Portrait of ${chairperson.name}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    width={160}
                    height={160}
                  />
                </div>

                <div className="absolute -bottom-2 right-2 bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                  Chairperson
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {chairperson.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-4">
                  {chairperson.title}
                </p>
                <blockquote className="relative text-base text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 pl-6 border-green-400">
                  <svg className="absolute -left-4 top-1 w-4 h-4 text-green-400 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  {chairperson.message}
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Director and Lecturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[director, ...lecturers].map(person => (
            <div
              key={person.id}
              className={`group rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700
                transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]
                ${hoveredCard === person.id ? '-translate-y-1' : ''}
                ${activeCard === person.id ? 'ring-2 ring-green-500 bg-green-50 dark:bg-gray-700' : ''}`}
              onMouseEnter={() => setHoveredCard(person.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveCard(activeCard === person.id ? null : person.id)}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow">
                    <Image
                      src={person.image}
                      alt={`Portrait of ${person.name}`}
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className={`absolute -bottom-1 right-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm tracking-wide
                    ${person.id === 1 ? 'bg-emerald-500' : 'bg-gradient-to-r from-green-400 to-green-600'}
`}>
                    {person.id === 1 ? 'Director' : 'Lecturer'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">
                    {person.title}
                  </p>

                </div>

              </div>
              <p className=" pt-2 text-gray-600 dark:text-gray-300 text-sm italic leading-snug">
                "{person.message}"
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
