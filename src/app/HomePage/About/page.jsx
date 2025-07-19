'use client';

import { useTheme } from '@/app/Theme/ThemeProvider';
import { motion } from 'framer-motion';
import Stats from './Stats';
import Mission from './Mission';
import CoreValues from './CoreValues';
import Activities from './Activities';
import { Users, Calendar, Trophy, Handshake, Rocket, BookOpen, Globe } from 'lucide-react';

const stats = [
  { number: '3000+', label: 'Active Members', icon: <Users className="text-green-600" size={32} /> },
  { number: '50+', label: 'Annual Events', icon: <Calendar className="text-green-600" size={32} /> },
  { number: '10+', label: 'Years Active', icon: <Trophy className="text-green-600" size={32} /> },
];

const coreValues = [
  { icon: <Handshake className="text-green-500" size={20} />, title: 'Collaboration', desc: 'Working together for impact' },
  { icon: <Rocket className="text-green-500" size={20} />, title: 'Innovation', desc: 'Creative solutions for tomorrow' },
  { icon: <BookOpen className="text-green-500" size={20} />, title: 'Learning', desc: 'Continuous skill development' },
  { icon: <Globe className="text-green-500" size={20} />, title: 'Global Vision', desc: 'Worldwide engineering network' },
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

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const About = () => {
  const { isDark } = useTheme();

  const backgroundGridColor = isDark
    ? 'rgba(79, 70, 229, 0.1)'
    : 'rgba(79, 70, 229, 0.05)';

  const sectionBgGradient = isDark
    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-r from-green-50/10 via-green-50/20 to-green-50/10';

  const textColor = isDark ? 'text-gray-300' : 'text-gray-800';

  return (
    <section className={`pt-24 pb-20 overflow-hidden min-h-[600px] z-0 relative ${sectionBgGradient}`}>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${backgroundGridColor} 1px, transparent 1.2px), 
          linear-gradient(to bottom, ${backgroundGridColor} 1px, transparent 1px)`,
          backgroundSize: '45px 45px',
        }}
      />
      <motion.div
        className={`max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 transition-all ${textColor}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex-1 flex flex-col justify-center" variants={containerVariants}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Empowering Future <br />
            <span className="text-green-600 hover:text-green-700 transition-colors duration-300">Engineers</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mb-8 leading-relaxed ${textColor}`}>
            IEEE Student Branch is a vibrant community of{' '}
            <strong className="text-green-600 hover:text-green-700 transition-colors duration-300">3000+ passionate members</strong> dedicated to
            innovation, learning, and professional growth in electrical and computer engineering.
          </p>

          <Stats stats={stats} />
          <Mission />
        </motion.div>

        <motion.aside className="w-full lg:w-96 flex-shrink-0 space-y-12" variants={containerVariants}>
          <CoreValues coreValues={coreValues} />
          <Activities activities={activities} />
        </motion.aside>
      </motion.div>
    </section>
  );
};

export default About;
