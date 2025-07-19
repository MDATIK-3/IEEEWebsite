const EventHighlights = ({ eventHighlights }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {eventHighlights.map((highlight, index) => {
          const IconComponent = highlight.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">{highlight.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventHighlights;