import Image from "next/image";

const EventImage = ({ event }) => {
  if (!event.image) return null;
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
      <Image
        src={event.image?.startsWith('/') ? event.image : `/${event.image}`}
        alt={event.eventName}
        width={800}
        height={450}
        priority={false}
        className="w-full h-64 sm:h-80 object-cover"
      />
    </div>
  );
};

export default EventImage;
