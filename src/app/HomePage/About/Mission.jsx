const Mission = () => {
  return (
    <div className="relative p-6 md:p-8 rounded-2xl shadow-md transition-all duration-500 group 
      bg-gradient-to-br from-green-50/40 to-green-100/30 
      dark:from-slate-800/40 dark:to-slate-900/40 
      border border-transparent 
      hover:border-green-300 dark:hover:border-emerald-500 
      hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-emerald-800/40">
      
      <h3 className="text-3xl font-extrabold text-green-600 dark:text-emerald-400 
        mb-4 group-hover:text-green-500 dark:group-hover:text-emerald-300 
        transition-colors duration-300">
        Our Mission
      </h3>
      
      <p className="text-gray-700 dark:text-gray-300 
        group-hover:text-gray-600 dark:group-hover:text-gray-200 
        text-lg leading-relaxed transition-colors duration-300">
        We conduct workshops, tech talks, coding sessions, and real-world projects that build
        <span className="font-semibold text-green-700 dark:text-emerald-300 
          group-hover:text-green-600 dark:group-hover:text-emerald-200 transition-colors duration-300"> leadership</span>,
        <span className="font-semibold text-green-700 dark:text-emerald-300 
          group-hover:text-green-600 dark:group-hover:text-emerald-200 transition-colors duration-300"> teamwork</span>, and
        <span className="font-semibold text-green-700 dark:text-emerald-300 
          group-hover:text-green-600 dark:group-hover:text-emerald-200 transition-colors duration-300"> hands-on engineering skills </span>
        for tomorrow's innovators.
      </p>
    </div>
  );
};

export default Mission;
