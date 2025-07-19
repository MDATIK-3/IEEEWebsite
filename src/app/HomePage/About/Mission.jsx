const Mission = () => {
  return (
    <div className="bg-green-100/60 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-6 md:p-8 rounded-2xl shadow-inner hover:bg-green-100/80 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all duration-300 group">
      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3 group-hover:text-green-900 dark:group-hover:text-green-100 transition-colors duration-300">
        Our Mission
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
        We conduct workshops, tech talks, coding sessions, and real-world projects that build
        leadership, teamwork, and hands-on engineering skills for tomorrow's innovators.
      </p>
    </div>
  );
};

export default Mission;