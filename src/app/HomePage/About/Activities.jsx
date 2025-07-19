const Activities = ({ activities }) => {
  return (
    <div className="group">
      <h3 className="text-xl font-bold mb-5 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
        What We Do
      </h3>
      <div className="flex flex-wrap gap-2">
        {activities.map((activity, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-transparent hover:bg-green-200 hover:text-green-900 hover:shadow-md hover:shadow-green-200/50 hover:border-green-300 transform transition-all duration-500 hover:-translate-y-1 hover:scale-110 cursor-pointer select-none active:scale-95 active:translate-y-0"
          >
            {activity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Activities;