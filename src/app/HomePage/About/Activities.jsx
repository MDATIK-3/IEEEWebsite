const Activities = ({ activities }) => {
  return (
    <div className="group">
      <h3 className="text-xl font-bold mb-5 
        text-gray-800 dark:text-gray-200 
        group-hover:text-green-600 dark:group-hover:text-emerald-400 
        transition-colors duration-300">
        What We Do
      </h3>

      <div className="flex flex-wrap gap-2">
        {activities.map((activity, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-sm font-medium select-none cursor-pointer
              bg-green-100 text-green-800 
              dark:bg-emerald-900/40 dark:text-emerald-200
              border border-transparent
              hover:bg-green-200 hover:text-green-900 
              dark:hover:bg-emerald-800/60 dark:hover:text-emerald-100
              hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-emerald-800/50
              hover:border-green-300 dark:hover:border-emerald-500
              transform transition-all duration-500 hover:-translate-y-1 hover:scale-110 
              active:scale-95 active:translate-y-0"
          >
            {activity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Activities;
