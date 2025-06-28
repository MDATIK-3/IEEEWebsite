'use client';

export default function HeroCard({ smoothedPosition, motion }) {
  return (
    <div className="relative z-10">
      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 overflow-hidden transition-all duration-500 ease-out hover:shadow-3xl"
        style={{
          transform: `translate3d(${(smoothedPosition.x - 0.5) * 20}px, ${(smoothedPosition.y - 0.5) * 15}px, 0) rotateY(${(smoothedPosition.x - 0.5) * 8}deg) rotateX(${(smoothedPosition.y - 0.5) * -5}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-green-400/40 to-emerald-500/40 rounded-full blur-xl animate-pulse"
          style={motion(-15, -15)}
        ></div>

        <div
          className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full blur-xl animate-pulse"
          style={motion(15, 15)}
        ></div>

        <div className="flex justify-center mb-6 group" style={motion(25, 20)}>
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white group-hover:border-green-200 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src="/images/hero.jpg"
              alt="Technology Innovation"
              className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>

        <div className="text-center transition-all duration-500" style={motion(8, 5)}>
          <p className="text-lg font-bold text-gray-800 mb-2">Building Tomorrow</p>
          <p className="text-sm text-gray-600">Innovation • Collaboration • Excellence</p>
        </div>
      </div>
    </div>
  );
}
