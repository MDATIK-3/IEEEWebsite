export default function ChatStyles() {
  return (
    <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.25s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .bg-grid-pattern {
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      .scroll-smooth {
        scroll-behavior: smooth;
      }
      .chat-panel {
        position: relative;
      }
      .chat-panel::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 1px solid rgba(148, 163, 184, 0.28);
        pointer-events: none;
      }
      .text-balance {
        text-wrap: balance;
      }
      .scroll-smooth::-webkit-scrollbar {
        width: 8px;
      }
      .scroll-smooth::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
      }
      .scroll-smooth::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      .scroll-smooth::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-fadeIn,
        .animate-slideUp {
          animation: none !important;
        }
      }
    `}</style>
  );
}
