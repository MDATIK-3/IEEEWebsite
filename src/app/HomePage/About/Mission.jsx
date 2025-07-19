const Mission = () => {
  return (
    <div className="bg-gradient-to-br from-green-50/10 to-green-100/10 border border-green-200 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 group">
      <h3 className="text-3xl font-extrabold text-green-600 mb-4 group-hover:text-green-500 transition-colors duration-300">
        Our Mission
      </h3>
      <p className="group-hover:text-green-500/80 text-lg leading-relaxed transition-colors duration-300">
        We conduct workshops, tech talks, coding sessions, and real-world projects that build
        <span className="font-semibold text-green-700"> leadership</span>,
        <span className="font-semibold text-green-700"> teamwork</span>, and
        <span className="font-semibold text-green-700"> hands-on engineering skills</span>
        for tomorrow's innovators.
      </p>
    </div>
  );
};

export default Mission;
