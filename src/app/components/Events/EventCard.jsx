import React, { useMemo, useCallback } from 'react';
import { IoMdTimer } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import Link from "next/link";
import { User } from 'lucide-react';

const calculateCountdown = (timeDiff) => {
  if (timeDiff <= 0) return null;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return dateString;
  }
};

const EventCard = ({ event, now, onError, onSelect }) => {
  if (!event) {
    console.error('EventCard: event prop is required');
    return null;
  }

  const {
    id,
    image,
    eventName,
    date,
    guest,
    time,
  } = event;

  const countdown = useMemo(() => {
    if (!date || !now) return null;

    try {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        console.warn('Invalid date provided:', date);
        return null;
      }

      const timeDiff = eventDate - now;
      return calculateCountdown(timeDiff);
    } catch (error) {
      console.warn('Countdown calculation error:', error);
      onError?.(error);
      return null;
    }
  }, [date, now, onError]);

  const formattedDate = useMemo(() => formatDate(date), [date]);

  const handleClick = useCallback(() => {
    try {
      onSelect?.(event);

      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('selectedEvent', JSON.stringify(event));
        } catch (storageError) {
          console.warn('localStorage error:', storageError);
        }
      }
    } catch (error) {
      console.error('EventCard click handler error:', error);
      onError?.(error);
    }
  }, [event, onSelect, onError]);

  const handleImageError = useCallback((e) => {
    console.warn('Image failed to load:', image);
    e.target.style.display = 'none';
  }, [image]);

  return (
    <article
      className="w-full h-full  bg-white dark:bg-base-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden"
      role="article"
      aria-label={`Event: ${eventName || 'Untitled Event'}`}
    >
      {image && (
        <figure className="h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Link
            href={`/details/${id}`}
            onClick={handleClick}
            aria-label={`View details for ${eventName || 'this event'}`}
          >
            <img
              src={image}
              alt={eventName ? `${eventName} event image` : 'Event image'}
              className="inline-block object-contain transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          </Link>
        </figure>
      )}

      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2 mb-3">
          {eventName || 'Untitled Event'}
        </h2>

        {countdown && (
          <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full inline-block mb-3 w-fit">
            {countdown}
          </div>
        )}

        <div className="flex-grow space-y-3">
          {guest && (
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <User
                  size={20}
                  strokeWidth={2}
                  absoluteStrokeWidth
                  className="text-green-400"
                />
                <span className="text-sm font-semibold">Guest:</span>
              </div>
              <span className="text-sm">{guest}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 pt-2 mt-auto">
          {date && (
            <div className="flex items-center gap-2">
              <CiCalendar className="text-lg text-green-400 dark:text-green-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-green-400 dark:text-green-300">
                {formattedDate}
              </span>
            </div>
          )}

          {time && (
            <div className="flex items-center gap-2 text-green-400 dark:text-green-300">
              <IoMdTimer className="text-lg flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{time}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default React.memo(EventCard);
