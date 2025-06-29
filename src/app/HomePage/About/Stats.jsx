'use client';

const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="group text-center p-6 bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl shadow-md hover:shadow-xl hover:shadow-green-200/50 hover:bg-white/90 hover:border-green-200 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
          <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">{stat.number}</div>
          <div className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
