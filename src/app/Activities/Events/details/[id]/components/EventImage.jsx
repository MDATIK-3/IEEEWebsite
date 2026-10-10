import Image from "next/image";
import { resolveImageSrc } from "@/app/utils/imageSrc";

const EventImage = ({ event }) => {
  if (!event.image) return null;
  return (
    <div className="rounded-2xl shadow-lg overflow-hidden border border-green-100">
      <Image
        src={resolveImageSrc(event.image)}
        alt={event.eventName}
        width={800}
        height={450}
        sizes="(max-width: 1024px) 100vw, 800px"
        priority={false}
        className="w-full object-cover"
      />
    </div>
  );
};

export default EventImage;
