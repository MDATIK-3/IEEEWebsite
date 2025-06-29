'use client';

export default function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 will-change-transform transition-transform duration-700">
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute top-60 right-32 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
}
