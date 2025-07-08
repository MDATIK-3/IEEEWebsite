'use client';
import React, { useState, useRef, useEffect } from 'react';

function FAQItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen 
        ? `${contentRef.current.scrollHeight}px`
        : '0px';
    }
  }, [isOpen]);

  return (
    <div 
      className={`mb-5 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
        isOpen 
          ? 'bg-green-50 border border-green-200 shadow-green-100' 
          : 'bg-white hover:bg-green-50 border border-green-100'
      }`}
    >
      <button
        className="w-full text-left p-5 flex justify-between items-center group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-green-700' : 'text-gray-800'}`}>
          {question}
        </span>
        <div className="ml-4 flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-green-100 rotate-180' : 'bg-green-50 group-hover:bg-green-100'}`}>
            <svg 
              className={`w-5 h-5 transition-colors ${isOpen ? 'text-green-600' : 'text-green-500 group-hover:text-green-600'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-500 overflow-hidden"
        style={{ maxHeight: '0px' }}
      >
        <div className="p-5 pt-0">
          <div className="pl-3 border-l-2 border-green-300">
            <p className="text-gray-600">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQList({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {data.map((item, index) => (
        <FAQItem 
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

export default function FAQ() {
  const faqData = [
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces. It lets you create reusable UI components and efficiently update and render them when data changes."
    },
    {
      question: "What are components?",
      answer: "Components are the building blocks of React applications. They are self-contained modules that render some output. Components can be nested, reused, and manage their own state."
    },
    {
      question: "How do I handle user input?",
      answer: "Use React's event system to handle user interactions. The most common approach is to use controlled components where form data is handled by React state."
    },
    {
      question: "Is React open source?",
      answer: "Yes! React is an open-source JavaScript library maintained by Meta (formerly Facebook) and a community of individual developers and companies."
    },
    {
      question: "Can I use React with TypeScript?",
      answer: "Absolutely! React has excellent TypeScript support. Many developers find that TypeScript enhances their React development experience with better tooling and type safety."
    },
    {
      question: "How does React compare to other frameworks?",
      answer: "React focuses primarily on the view layer, making it flexible to integrate with other libraries. Unlike full frameworks, React gives developers freedom to choose routing, state management, and other solutions."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about our product. 
          <span className="text-emerald-600 font-medium"> Can't find an answer? Contact us.</span>
        </p>
      </div>
      
      <FAQList data={faqData} />
      
      <div className="max-w-4xl mx-auto mt-16 text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Still have questions?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Our support team is here to help you with any questions you might have.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
          Contact Support
        </button>
      </div>
    </div>
  );
}