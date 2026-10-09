const EventHighlights = ({ eventHighlights }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-green-100 dark:border-green-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Event Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {eventHighlights.map((highlight, index) => {
          const IconComponent = highlight.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-green-100 dark:border-green-700 
                         hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-out"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 
                              group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {highlight.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventHighlights;
