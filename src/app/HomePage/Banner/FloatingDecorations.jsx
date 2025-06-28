'use client';

export default function FloatingDecorations({ motion }) {
  return (
    <>
      <img
        src="/images/heroLogo.png"
        alt="Hero Logo"
        className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-transparent shadow-xl animate-bounce"
        style={motion(-12, -12)}
      />

      <div
        className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-xl animate-bounce"
        style={motion(12, 12)}
      ></div>

      <div
        className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-lg animate-ping"
        style={motion(-18, 8)}
      ></div>
    </>
  );
}
