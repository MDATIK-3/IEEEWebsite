'use client';

import { useRef } from 'react';
import Stats from './Stats';
import Mission from './Mission';
import CoreValues from './CoreValues';
import Activities from './Activities';

const stats = [
  { number: '3000+', label: 'Active Members', icon: '👥' },
  { number: '50+', label: 'Annual Events', icon: '📅' },
  { number: '10+', label: 'Years Active', icon: '🏆' },
];

const coreValues = [
  { icon: '🤝', title: 'Collaboration', desc: 'Working together for impact' },
  { icon: '🚀', title: 'Innovation', desc: 'Creative solutions for tomorrow' },
  { icon: '📖', title: 'Learning', desc: 'Continuous skill development' },
  { icon: '🌍', title: 'Global Vision', desc: 'Worldwide engineering network' },
];

const activities = [
  'Workshops',
  'Tech Talks',
  'Coding Sessions',
  'Projects',
  'Mentorship',
  'Competitions',
  'Networking',
];

const About = () => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="pt-24 pb-20 bg-gradient-to-b from-green-50/70 via-green-50/40 to-green-50/50 text-gray-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 transition-all">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Empowering Future <br />
            <span className="text-green-600 hover:text-green-700 transition-colors duration-300">Engineers</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
            IEEE Student Branch is a vibrant community of{' '}
            <strong className="text-green-600 hover:text-green-700 transition-colors duration-300">3000+ passionate members</strong> dedicated to
            innovation, learning, and professional growth in electrical and computer engineering.
          </p>

          <Stats stats={stats} />

          <Mission />
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 space-y-12">
          <CoreValues coreValues={coreValues} />

          <Activities activities={activities} />
        </aside>
      </div>
    </section>
  );
};

export default About;
