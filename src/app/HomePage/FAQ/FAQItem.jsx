'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`group mb-6 rounded-xl transition-all duration-500 overflow-hidden border
        ${isOpen
          ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100 dark:bg-gray-800 dark:border-emerald-600 dark:shadow-md dark:shadow-emerald-900'
          : 'bg-white border-gray-200 hover:bg-white/80 hover:shadow dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:shadow'
        }
      `}
      data-open={isOpen ? 'true' : 'false'}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h2
          className={`text-base sm:text-lg font-medium transition-colors
            ${isOpen
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-gray-800 group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400'
            }
          `}
        >
          {question}
        </h2>
        <div
          className={`ml-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border
            ${isOpen
              ? 'rotate-180 border-emerald-600'
              : 'border-transparent hover:bg-emerald-100 dark:hover:bg-emerald-900'
            }
          `}
        >
          <ChevronDown
            className={`w-5 h-5 transition-all duration-300
              ${isOpen ? 'text-emerald-400' : 'text-emerald-500'}
            `}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="px-5 sm:px-6 pt-0 overflow-hidden"
          >
            <div className="border-l-4 pl-4 py-4 rounded-r-lg border-emerald-400 bg-emerald-50/10 dark:border-emerald-600 dark:bg-emerald-900/30">
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
