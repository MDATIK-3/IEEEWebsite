'use client';

import { useEffect, useState } from 'react';

const PHRASES = [
    'Thinking about this page',
    'Arranging the layout',
    'Tuning the visuals',
    'Polishing the details',
];

const TYPE_SPEED = 55;
const DELETE_SPEED = 28;
const HOLD_TIME = 900;

export default function LoadingState() {
    const [display, setDisplay] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const phrase = PHRASES[phraseIndex];
        const isComplete = display === phrase;
        const isEmpty = display === '';
        let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

        if (!isDeleting && isComplete) delay = HOLD_TIME;
        if (isDeleting && isEmpty) delay = 300;

        const handle = setTimeout(() => {
            if (!isDeleting) {
                if (isComplete) {
                    setIsDeleting(true);
                } else {
                    setDisplay(phrase.slice(0, display.length + 1));
                }
            } else {
                if (isEmpty) {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
                } else {
                    setDisplay(phrase.slice(0, display.length - 1));
                }
            }
        }, delay);

        return () => clearTimeout(handle);
    }, [display, isDeleting, phraseIndex]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="text-center space-y-4 rounded-3xl border border-emerald-100 bg-white/80 dark:bg-slate-900/80 dark:border-emerald-800 px-8 py-10 shadow-xl backdrop-blur-sm">
                <div className="inline-flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-emerald-700 dark:text-emerald-200 text-sm font-semibold">
                    IEEE GUB Assistant
                </div>

                <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    <span aria-live="polite">{display}</span>
                    <span className="ml-1 inline-block h-6 w-[2px] align-middle bg-emerald-600 animate-pulse" />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait a moment while we prepare everything.
                </p>
            </div>
        </div>
    );
}
