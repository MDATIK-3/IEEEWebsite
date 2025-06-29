'use client';

const CoreValues = ({ coreValues }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-5">Core Values</h3>
      <div className="space-y-4">
        {coreValues.map((val, i) => (
          <div
            key={i}
            className="group flex items-start gap-4 p-5 bg-white/80 border border-gray-200 rounded-xl shadow hover:shadow-lg hover:shadow-green-100/50 hover:bg-white/95 hover:border-green-200 transform transition-all duration-300 hover:-translate-y-1 hover:scale-102 cursor-pointer"
          >
            <div className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{val.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-green-800 transition-colors duration-300">{val.title}</h4>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{val.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreValues;
