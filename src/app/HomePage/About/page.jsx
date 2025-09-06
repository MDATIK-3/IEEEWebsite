'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.1 }
  }
};

const fancyVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -15, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1], 
      opacity: { duration: 0.5 }
    }
  }
};

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={ref}
      className={`
        relative pt-24 pb-20 overflow-hidden min-h-[600px] z-0
        bg-gradient-to-br from-green-50 via-white to-green-100
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      `}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ y }}
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(79,70,229,0.08)_1px,transparent_1.2px),linear-gradient(to_bottom,rgba(79,70,229,0.08)_1px,transparent_1px)] bg-[length:45px_45px]" />
      </motion.div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 text-gray-800 dark:text-gray-300 transition-all"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
      >
        <motion.div className="flex-1 flex flex-col justify-center" variants={fancyVariants}>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            variants={fancyVariants}
            whileHover={{ scale: 1.05, rotateY: -3, textShadow: "0px 0px 12px rgba(34,197,94,0.6)" }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Empowering Future <br />
            <motion.span
              className="text-green-600 hover:text-green-700 dark:hover:text-green-500 transition-colors duration-300 inline-block"
              whileHover={{ scale: 1.1, rotate: -2 }}
            >
              Engineers
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed"
            variants={fancyVariants}
          >
            IEEE Student Branch is a vibrant community of{' '}
            <strong className="text-green-600 hover:text-green-700 dark:hover:text-green-500 transition-colors duration-300">
              3000+ passionate members
            </strong>{' '}
            dedicated to innovation, learning, and professional growth in electrical and computer engineering.
          </motion.p>

          <motion.div variants={fancyVariants}>
            <Stats stats={stats} />
          </motion.div>

          <motion.div variants={fancyVariants}>
            <Mission />
          </motion.div>
        </motion.div>

        <motion.aside
          className="w-full lg:w-96 flex-shrink-0 space-y-12"
          variants={fancyVariants}
        >
          <CoreValues coreValues={coreValues} />
          <Activities activities={activities} />
        </motion.aside>
      </motion.div>
    </section>
  );
};

export default About;
