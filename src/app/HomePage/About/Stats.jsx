const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center border border-transparent hover:scale-[1.02] bg-white backdrop-blur-md  rounded-2xl shadow-md hover:shadow-xl hover:shadow-green-200/50 hover:bg-white hover:border-green-200 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer p-5 w-full max-w-[90%] sm:max-w-[300px] md:max-w-none mx-auto"
        >
          <div>{stat.icon}</div>
          <div className="text-2xl font-bold">{stat.number}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
