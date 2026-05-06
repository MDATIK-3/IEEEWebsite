const EventDescription = ({ event, isPastEvent }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-green-100 dark:border-green-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        About This Event
      </h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
        {event.description ||
          `Join us for an insightful ${event.eventType.toLowerCase()} on the latest trends in professional development and cyber skills. 
        This event features industry experts and interactive sessions designed to enhance your professional capabilities in the digital age.`}
        {isPastEvent &&
          " This event has concluded successfully with great participation and valuable insights shared."}
      </p>
    </div>
  );
};

export default EventDescription;
