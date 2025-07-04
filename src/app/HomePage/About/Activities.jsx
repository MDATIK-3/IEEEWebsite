'use client';

const Activities = ({ activities }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-5">What We Do</h3>
      <div className="flex flex-wrap gap-2">
        {activities.map((activity, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 hover:text-green-900 hover:shadow-md hover:shadow-green-200/50 transform transition-all duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer select-none"
          >
            {activity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Activities;
