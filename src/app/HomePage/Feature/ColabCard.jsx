const ColabCard = ({ event }) => {
  const { image, name, organization } = event;

  return (
    <div className="h-80 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-sm transition-shadow duration-300 border border-emerald-100 group cursor-pointer">
      <figure className="h-64 w-full border-b border-gray-400 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </figure>

      <div className="h-16 p-4 flex flex-col justify-center space-y-1">
        <h2 className="text-base font-bold text-gray-800 leading-tight line-clamp-1">
          {name}
        </h2>
        <h3 className="text-xs text-gray-600 leading-tight line-clamp-1">
          with <span className="font-semibold text-emerald-600">{organization}</span>
        </h3>
      </div>
    </div>
  );
};

export default ColabCard;