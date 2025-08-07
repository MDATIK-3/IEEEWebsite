/* File: components/DeveloperCard.jsx */
'use client';
import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DeveloperProfile from './DeveloperProfile';
import SectionHeader from './SectionHeader';
import developerData from '@/data/developerData.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const DeveloperCard = () => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html, body, * {
        scroll-behavior: smooth !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const projectLeads = developerData.filter(dev =>
    ["Chair", "Project Coordinator"].includes(dev.developer_type)
  );
  const developmentTeam = developerData.filter(dev =>
    !["Chair", "Project Coordinator"].includes(dev.developer_type)
  );

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24"
      style={{ willChange: 'scroll-position', scrollBehavior: 'smooth' }}
    >
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.3 : 1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            IEEE GUB Website Development Team
          </motion.h2>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          />
          <motion.p
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            A dedicated team of innovators crafting exceptional digital experiences with cutting-edge solutions.
          </motion.p>
        </motion.div>
      </section>

      {projectLeads.length > 0 && (
        <section className="text-center">
          <SectionHeader
            title="Project Leadership"
            color="text-emerald-600 dark:text-emerald-400"
            delay={0.1}
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {projectLeads.map((dev, index) => (
              <DeveloperProfile key={dev.id} dev={dev} index={index} />
            ))}
          </motion.div>
        </section>
      )}

      {developmentTeam.length > 0 && (
        <section className="text-center">
          <SectionHeader title="Development Team" delay={0.1} />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {developmentTeam.map((dev, index) => (
              <DeveloperProfile key={dev.id} dev={dev} index={index} />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default DeveloperCard;
