'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@/app/Theme/ThemeProvider';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  const { isDark } = useTheme();
  console.log(isDark)

  const containerClass = isOpen
    ? isDark
      ? 'bg-gray-800 border-emerald-600 shadow-md shadow-emerald-900'
      : 'bg-white border-emerald-300 shadow-md shadow-emerald-100'
    : isDark
    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 hover:shadow'
    : 'bg-white border-gray-200 hover:bg-white/80 hover:shadow';

  const questionTextClass = isOpen
    ? isDark
      ? 'text-emerald-400'
      : 'text-emerald-700'
    : isDark
    ? 'text-gray-300 group-hover:text-emerald-400'
    : 'text-gray-800 group-hover:text-emerald-600';

  const iconContainerClass = isOpen
    ? 'rotate-180 border-emerald-600'
    : isDark
    ? 'hover:bg-emerald-900 border-transparent'
    : 'hover:bg-emerald-100 border-transparent';

  const iconColorClass = isOpen ? 'text-emerald-400' : 'text-emerald-500';

  const answerContainerClass = isDark
    ? 'border-emerald-600 bg-emerald-900/30'
    : 'border-emerald-400 bg-emerald-50/10';

  const answerTextClass = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <motion.div
      variants={itemVariants}
      className={`group mb-6 rounded-xl transition-all duration-500 overflow-hidden border ${containerClass}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h2
          className={`text-base sm:text-lg font-medium transition-colors ${questionTextClass}`}
        >
          {question}
        </h2>
        <div
          className={`ml-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${iconContainerClass}`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-all duration-300 ${iconColorClass}`}
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
            <div className={`border-l-4 pl-4 py-4 rounded-r-lg ${answerContainerClass}`}>
              <p className={`text-sm sm:text-base leading-relaxed ${answerTextClass}`}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
