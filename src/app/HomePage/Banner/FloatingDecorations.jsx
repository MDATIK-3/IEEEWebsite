export default function FloatingDecorations() {
  return (
    <>
      <div
        className="absolute -bottom-6 -right-6 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-xl motion-safe:animate-bounce"
      ></div>

      <div
        className="absolute top-1/2 -left-8 w-8 h-8 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-lg motion-safe:animate-ping"
      ></div>
    </>
  );
}