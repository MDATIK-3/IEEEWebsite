'use client';

import Image from 'next/image';
import { useState } from 'react';
import moderators from '@/data/moderatorsMessages.json';
import { motion } from 'framer-motion';

export default function ModeratorMessages() {
  const [activeCard, setActiveCard] = useState(null);

  const chairperson = moderators.find(mod => mod.id === 3);
  const director = moderators.find(mod => mod.id === 1);
  const lecturers = moderators.filter(mod => mod.id !== 1 && mod.id !== 3);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], 
        staggerChildren: 0.1
      }
    }
  };

  const hoverEffect = {
    scale: 1.03,
    y: -8,
    boxShadow: '0px 20px 40px rgba(0,0,0,0.12)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      mass: 0.8
    }
  };

  const imageHoverVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 right-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 left-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-900/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
          >
            Leadership Insights
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Green University Visionaries
          </motion.h1>
          <motion.div
            className="h-1 w-24 bg-green-500 mx-auto mb-6 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          />
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Perspectives from our academic leaders driving sustainable innovation
          </motion.p>
        </motion.div>

        <motion.div
          className={`group w-full max-w-4xl mx-auto mb-20 rounded-2xl p-8 border shadow-md cursor-pointer
            ${activeCard === chairperson?.id ? 'border-green-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'}
            bg-white dark:bg-gray-800
          `}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          whileHover={hoverEffect}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveCard(activeCard === chairperson?.id ? null : chairperson?.id)}
          layout
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="relative flex-shrink-0"
              variants={imageHoverVariants}
              initial="rest"
              whileHover="hover"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-green-400 dark:border-green-600 shadow-lg ring-4 ring-green-200/30 dark:ring-green-900/30">
                <Image
                  src={chairperson?.image || ''}
                  alt={`Portrait of ${chairperson?.name}`}
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <motion.div
                className="absolute -bottom-2 right-4 bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm tracking-wide"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
              >
                Branch Counselor
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{chairperson?.name}</h3>
              <p className="text-green-600 dark:text-green-400 font-medium mb-4">{chairperson?.title}</p>
              <blockquote className="relative text-base text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 pl-6 border-green-400">
                <svg className="absolute -left-4 top-1 w-4 h-4 text-green-400 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                {chairperson?.message}
              </blockquote>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {[director, ...lecturers].map((person, index) => (
            <motion.div
              key={person.id}
              className={`group rounded-2xl p-6 border shadow-sm cursor-pointer
                ${activeCard === person.id ? 'border-green-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'}
                bg-white dark:bg-gray-800
              `}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: '0px 15px 30px rgba(0,0,0,0.1)',
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCard(activeCard === person.id ? null : person.id)}
              layout
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    transition: { type: 'spring', stiffness: 250, damping: 15 }
                  }}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow">
                    <Image
                      src={person.image}
                      alt={`Portrait of ${person.name}`}
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 right-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm tracking-wide bg-gradient-to-r from-green-400 to-green-600"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.8 + (index * 0.1),
                      type: "spring",
                      stiffness: 400
                    }}
                  >
                    Mentor
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{person.name}</h3>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">{person.title}</p>
                </motion.div>
              </div>
              <motion.p
                className="pt-2 text-gray-600 dark:text-gray-300 text-sm italic leading-snug"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                "{person.message}"
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}