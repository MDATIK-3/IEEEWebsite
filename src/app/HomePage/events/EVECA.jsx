import { IoMdTimer } from "react-icons/io";
import { IoMdPeople } from "react-icons/io"; 


import { CiCalendar } from "react-icons/ci";
import Link from "next/link";

const Card = ({ event, now }) => {
  const { id, image, eventName, date, guest, time } = event;

  const eventDate = new Date(date);
  const timeDiff = eventDate - now;

  let countdown = null;

  if (timeDiff > 0) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="w-96  dark:bg-base-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <figure className="h-56 overflow-hidden">
        <Link href={`/details/${id}`}>
          <img
            src={image}
            alt={eventName}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </figure>

      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{eventName}</h2>

        {guest && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-base">
            <IoMdPeople className="text-xl" />
            <span>
              <b>Guests:</b> {guest}
            </span>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-200">
            <CiCalendar className="text-lg" />
            <span>{date}</span>
          </div>

          {time && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
              <IoMdTimer className="text-lg" />
              <span>{time}</span>
            </div>
          )}
        </div>

        {/* Countdown */}
        {countdown && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full animate-pulse">
              ⏳ Starts in: {countdown}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
