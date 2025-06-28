import React from 'react';
import EventCard from './EventCard';

const EventsGrid = ({ events, now, onError }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No events to display
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((event, index) => {
          if (!event?.id) {
            console.warn(`Invalid event at index ${index}:`, event);
            return null;
          }

          return (
            <div
              key={event.id}
              className="flex justify-center animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="w-full h-[600px]">
                <div className="w-full h-full transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                  <EventCard event={event} now={now} onError={onError} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(EventsGrid);
