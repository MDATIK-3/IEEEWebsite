'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroText() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const texts = ['IEEE Community', 'Tech Innovation Hub', 'Student Network', 'Future Leaders'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timing = {
      typingSpeed: isMobile ? 75 : 100,
      deletingSpeed: isMobile ? 40 : 50,
      pause: isMobile ? 1200 : 2000,
    };

    const current = texts[index];
    let timeoutId;

    if (!deleting && text !== current) {
      timeoutId = setTimeout(() => setText(current.slice(0, text.length + 1)), timing.typingSpeed);
    } else if (deleting && text !== '') {
      timeoutId = setTimeout(() => setText(text.slice(0, -1)), timing.deletingSpeed);
    } else if (!deleting && text === current) {
      setTypingDone(true);
      timeoutId = setTimeout(() => {
        setDeleting(true);
        setTypingDone(false);
      }, timing.pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeoutId);
  }, [text, deleting, index, isMobile]);

  useEffect(() => {
    const blinkSpeed = 530;
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, blinkSpeed);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 py-10 sm:py-14 max-w-screen-xl mx-auto text-left">
      <div className="space-y-3 sm:space-y-5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight sm:leading-snug">
          <span className="block">Bangladesh's Largest</span>
          <span className="relative block h-[1.5em] sm:h-[1.8em] mt-1 min-h-[1.5em]">
            <span className="absolute top-0 left-0 font-extrabold whitespace-nowrap bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {text}
              <span
                className={`ml-1 text-green-600 transition-opacity duration-150 ${
                  cursorVisible && !typingDone ? 'opacity-100' : 'opacity-0'
                }`}
              >
                |
              </span>
            </span>
            <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full max-w-[12em] h-0.5 sm:h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-full opacity-80 transition-opacity duration-300" />
          </span>
        </h1>
      </div>

      <div className="mt-6 sm:mt-8 max-w-xl">
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Join Bangladesh's premier IEEE Student Branch at Green University of Bangladesh, leading
          innovation in Computer Science, Engineering, and sustainable tech.
        </p>
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <Link
          href="/contact"
          aria-label="Join IEEE GUB"
          className="w-full sm:w-auto text-center inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Join IEEE GUB
          <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300" />
        </Link>

        <Link
          href="/Events"
          aria-label="Explore Events"
          className="w-full sm:w-auto text-center inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-gray-700 bg-white backdrop-blur border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Explore Events
        </Link>
      </div>

      <style jsx>{`
        h1 {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
