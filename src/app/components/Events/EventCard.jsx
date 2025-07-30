'use client'

import { useState, useEffect, useCallback } from 'react';
import { IoMdTimer } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import Link from "next/link";
import { User } from 'lucide-react';

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const EventCard = ({ event, onError, onSelect }) => {
  if (!event) return null;

  const { id, image, eventName, date, guest, time } = event;
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!date) return;
    const eventDate = new Date(date);
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate - now;
      if (diff <= 0) return setCountdown(null);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const handleClick = useCallback(() => {
    try {
      onSelect?.(event);
      localStorage?.setItem('selectedEvent', JSON.stringify(event));
    } catch (error) {
      onError?.(error);
    }
  }, [event, onSelect, onError]);

  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
  }, []);

  return (
    <article
      className="group relative w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-500 transform hover:scale-[1.025] hover:-translate-y-1 overflow-hidden"
      role="article"
    >
      {image && (
        <figure className="relative h-56 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
          <Link href={`/Events/details/${id}`} onClick={handleClick} className="block w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={image}
                alt={eventName || 'Event image'}
                onError={handleImageError}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </Link>

          {countdown && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
              <IoMdTimer className="text-sm animate-pulse" />
              {countdown}
            </div>
          )}
        </figure>
      )}

      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {eventName || 'Untitled Event'}
        </h2>

        {guest && (
          <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <User size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-semibold">Guest:</span>
            </div>
            <span className="text-sm">{guest}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-3 pt-4 mt-auto border-t border-zinc-200 dark:border-zinc-700">
          {date && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg group-hover:scale-105 transition-transform">
              <CiCalendar className="text-lg text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {formatDate(date)}
              </span>
            </div>
          )}

          {time && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg group-hover:scale-105 transition-transform">
              <IoMdTimer className="text-lg text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{time}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
