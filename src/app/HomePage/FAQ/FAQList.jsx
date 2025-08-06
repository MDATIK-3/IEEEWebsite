'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FAQItem from './FAQItem';

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

export default function FAQList({ data }) {
  const [openIndex, setOpenIndex] = useState(null); 

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {data.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </motion.div>
  );
}
