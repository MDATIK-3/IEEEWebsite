import ShimmerEffect from "@/app/components/ShimmerEffect";

const ColabCard = ({ event }) => {
  const { image, name } = event;

  return (
    <div
      className="
        group relative overflow-hidden
        bg-white/80 dark:bg-gray-800/90 hover:bg-transparent
        backdrop-blur-sm
        border border-gray-200/60 dark:border-gray-700/60
        rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl
        transition-all duration-500 ease-out
        hover:-translate-y-2 hover:scale-[1.02]
        p-6 min-h-[160px]
        focus:outline-none focus:ring-4 focus:ring-emerald-400/30 dark:focus:ring-emerald-500/40
        hover:border-emerald-300/60 dark:hover:border-emerald-500/60
      "
    >
      <div className="relative w-full h-20 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
        <img
          src={image}
          alt={`${name} logo`}
          className="
            max-w-full max-h-full object-contain
            transition-all duration-500
            filter drop-shadow-sm group-hover:drop-shadow-md
          "
          draggable={false}
          loading="lazy"
        />
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
          {name}
        </h3>
      </div>

      <ShimmerEffect />
    </div>
  );
};

export default ColabCard;
