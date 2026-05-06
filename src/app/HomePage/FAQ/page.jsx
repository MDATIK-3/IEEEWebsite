'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FAQList from './FAQList';
import faqData from '@/data/FAQ.json';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      ease: 'easeOut',
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={`
    relative py-16 px-4 sm:px-6 overflow-hidden
    bg-[linear-gradient(to_right,rgba(16,255,15,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,255,15,0.2)_1px,transparent_1px)]
    bg-[length:40px_40px]
    dark:bg-[linear-gradient(to_right,rgba(16,185,129,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.2)_1px,transparent_1px)]
    dark:bg-[length:40px_40px]
  `}
    >

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-14">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold
                       bg-gradient-to-r from-green-600 via-teal-600 to-green-700
                       bg-clip-text text-transparent leading-tight
                       dark:from-emerald-400 dark:via-teal-400 dark:to-green-500"
          >
            Frequently Asked
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold">
              Questions
            </span>
          </h1>
        </motion.div>
        <FAQList data={faqData} />
      </div>
    </motion.section>
  );
}
