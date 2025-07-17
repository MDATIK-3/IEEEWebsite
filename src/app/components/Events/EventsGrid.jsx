'use client'
import { motion } from 'framer-motion';
import EventCard from './EventCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const EventsGrid = ({ events, now, onError }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 h-full min-h-[300px]">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No events to display
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event, index) => {
        if (!event?.id) {
          console.warn(`Invalid event at index ${index}:`, event);
          return null;
        }

        return (
          <motion.div
            key={event.id}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="h-full"
          >
            <EventCard event={event} now={now} onError={onError} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default EventsGrid;
