'use client';

export default function RadialBackground() {
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full animate-float"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%), 
              radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)
            `,
            backgroundSize: '400px 400px',
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(20px, -15px) rotate(15deg) scale(1.05);
          }
          50% {
            transform: translate(-15px, 20px) rotate(30deg) scale(1.1);
          }
          75% {
            transform: translate(10px, -10px) rotate(15deg) scale(1.05);
          }
        }
        .animate-float {
          animation: float 25s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
