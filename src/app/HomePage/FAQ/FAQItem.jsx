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
      className={`group mb-6 rounded-xl transition-all duration-500 overflow-hidden border ${
        isOpen
          ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100'
          : 'bg-white/70 border-gray-200 hover:bg-white/80 hover:shadow'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h2
          className={`text-base sm:text-lg font-medium transition-colors ${
            isOpen ? 'text-emerald-700' : 'text-gray-800 group-hover:text-emerald-600'
          }`}
        >
          {question}
        </h2>
        <div
          className={`ml-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
            isOpen
              ? 'bg-emerald-100 rotate-180 border-emerald-300'
              : 'bg-emerald-50 hover:bg-emerald-100 border-transparent'
          }`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-all duration-300 ${
              isOpen ? 'text-emerald-600' : 'text-emerald-500'
            }`}
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
            <div className="border-l-4 border-emerald-400 pl-4 py-4 bg-emerald-50/30 rounded-r-lg">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
