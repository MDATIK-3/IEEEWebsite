export default function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 will-change-transform transition-transform duration-700">
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl motion-safe:animate-pulse" />
      <div
        className="absolute top-60 right-32 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-xl motion-safe:animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}


