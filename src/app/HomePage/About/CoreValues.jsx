const CoreValues = ({ coreValues }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200">
        Core Values
      </h3>
      <div className="space-y-4">
        {coreValues.map((val, i) => (
          <div
            key={i}
            className="
              group flex items-start gap-4 p-5 rounded-xl border shadow
              bg-white border-gray-200 shadow-gray-100
              dark:bg-gray-800 dark:border-gray-700 dark:shadow-none

              hover:bg-green-50 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50
              dark:hover:bg-gray-700/60 dark:hover:border-green-500/30 dark:hover:shadow-green-500/10
              
              transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer
            "
          >
            <div className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
              {val.icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                {val.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {val.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreValues;
