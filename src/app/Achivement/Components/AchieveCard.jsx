import Image from 'next/image';
import achievement from '@/data/acievement.json';

const AchieveCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {achievement.map(({ id, year, program_name, details, image }) => (
        <div
          key={id}
          className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Image */}
          <div className="relative w-full h-48">
            <Image
              src={image}
              alt={program_name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-xl"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{year}</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {program_name}
            </h3>
            <hr className="my-3 border-gray-300 dark:border-zinc-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchieveCard;
