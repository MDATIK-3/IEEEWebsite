import BgColor from "@/app/components/BgColor";
import { Calendar, Clock } from 'lucide-react';
import Link from "next/link";

const HeroSection = ({ event, isPastEvent, formatDate }) => (
  <div className="relative bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-hidden">

    <div className="absolute inset-0 bg-black/20 dark:bg-slate-900/50" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">

      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-5 ">

        <Link href="/Events">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full  text-white dark:bg-slate-800/60 dark:text-slate-200 border border-white/30 dark:border-slate-700 hover:bg-white/30 dark:hover:bg-slate-700/70 backdrop-blur-md text-sm font-medium transition">
            ← Back to Events
          </span>
        </Link>

      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-slate-100 leading-tight mb-6 drop-shadow-lg select-none relative inline-block group">
        {event.eventName}
        <span
          className="block absolute left-1/2 -bottom-1 h-1 w-full bg-gradient-to-r from-cyan-400 to-green-400 dark:from-cyan-500 dark:to-emerald-500
          scale-x-0 group-hover:scale-x-100 origin-center -translate-x-1/2 transition-transform duration-300 ease-in-out rounded"
        />
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-white/90 dark:text-slate-300 text-base sm:text-lg mb-10">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400 dark:text-cyan-500" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full" />
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400 dark:text-emerald-400" />
          <span>{event.time}</span>
        </div>
      </div>

      {!isPastEvent && (
        <button
          type="button"
          className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-green-400 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:from-cyan-600 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-emerald-400 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Register Now
        </button>
      )}
    </div>

    <BgColor />
  </div>
);

export default HeroSection;
