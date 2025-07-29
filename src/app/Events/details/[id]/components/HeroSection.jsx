'use client';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const HeroSection = ({ event, isPastEvent, formatDate }) => (
    <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-teal-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-700 ease-in-out">
        <div className="absolute inset-0 bg-black opacity-20 dark:bg-slate-900/50 transition-opacity duration-700 ease-in-out" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col justify-center items-center text-center animate-fade-in-up">
            <div
                className={`inline-flex items-center px-5 py-2 rounded-full backdrop-blur-md text-sm font-semibold mb-6 border shadow-sm transition-colors duration-300 ${isPastEvent
                    ? 'bg-white/25 dark:bg-slate-800/70 text-white dark:text-slate-200 border-white/20 dark:border-slate-700/60'
                    : 'bg-white/25 dark:bg-slate-800/70 text-white dark:text-slate-200 border-white/20 dark:border-slate-700/60'
                    }`}
            >
                {isPastEvent ? (
                    <>
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400 dark:text-emerald-400 transition-transform duration-300 hover:scale-110" />
                        Past Event
                    </>
                ) : (
                    <>
                        <Calendar className="w-5 h-5 mr-2 text-cyan-400 dark:text-cyan-500 transition-transform duration-300 hover:scale-110" />
                        Upcoming Event
                    </>
                )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-slate-100 mb-8 leading-tight drop-shadow-lg cursor-default select-none relative inline-block group">
                {event.eventName}
                <span
                    className="block absolute left-1/2 -bottom-1 h-1 w-full bg-gradient-to-r from-cyan-400 to-green-400 dark:from-cyan-500 dark:to-emerald-500
             scale-x-0 group-hover:scale-x-100 origin-center -translate-x-1/2
             transition-transform duration-300 ease-in-out rounded"
                />
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90 dark:text-slate-300 text-lg select-none mb-10">
                <div className="flex items-center gap-2 cursor-default">
                    <Calendar className="w-6 h-6 text-cyan-400 dark:text-cyan-500 transition-transform duration-300 hover:scale-110" />
                    <span>{formatDate(event.date)}</span>
                </div>

                <div className="hidden sm:block w-1 h-1 bg-white/60 dark:bg-slate-400/60 rounded-full" />

                <div className="flex items-center gap-2 cursor-default">
                    <Clock className="w-6 h-6 text-green-400 dark:text-emerald-400 transition-transform duration-300 hover:scale-110" />
                    <span>{event.time}</span>
                </div>
            </div>

            {!isPastEvent && (
                <button
                    type="button"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-green-400 text-white rounded-full font-semibold text-lg shadow-lg hover:from-cyan-600 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-emerald-400 transition transform hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                >
                    Register Now
                </button>
            )}
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div
                className="absolute -top-14 -right-14 w-52 h-52 bg-white/20 dark:bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow"
                style={{ transform: 'translate3d(0, 0, 0)' }}
            />
            <div
                className="absolute top-1/2 -left-28 w-80 h-80 bg-white/10 dark:bg-teal-400/20 rounded-full blur-4xl animate-pulse"
                style={{ transform: 'translate3d(0, 0, 0)' }}
            />
        </div>

    </div>
);

export default HeroSection;