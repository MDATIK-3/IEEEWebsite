const Mission = () => {
  return (
    <div className="relative p-6 md:p-8 rounded-2xl shadow-md transition-all duration-500 group bg-gradient-to-br from-green-50/20 to-green-100/20 border border-transparent hover:border-green-300 hover:scale-[1.02] hover:shadow-2xl">
      <h3 className="text-3xl font-extrabold text-green-600 mb-4 group-hover:text-green-500 transition-colors duration-300">
        Our Mission
      </h3>
      <p className="text-gray-700 group-hover:text-gray-600 text-lg leading-relaxed transition-colors duration-300">
        We conduct workshops, tech talks, coding sessions, and real-world projects that build
        <span className="font-semibold text-green-700 group-hover:text-green-600 transition-colors duration-300"> leadership</span>,
        <span className="font-semibold text-green-700 group-hover:text-green-600 transition-colors duration-300"> teamwork</span>, and
        <span className="font-semibold text-green-700 group-hover:text-green-600 transition-colors duration-300"> hands-on engineering skills</span>
        for tomorrow's innovators.
      </p>
    </div>
  );
};

export default Mission;