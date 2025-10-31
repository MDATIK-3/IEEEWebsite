import { Trash2, RotateCcw, Sparkles, X } from 'lucide-react';

export default function ChatHeader({ isModal, isLoading, messages = [], onRetry, onClear, onClose }) {
  return (
    <header className="relative px-6 py-4 bg-gradient-to-r from-green-700 via-green-800 to-green-700 dark:from-slate-900 dark:via-green-950 dark:to-green-950 border-b border-green-700/50 dark:border-slate-800 rounded-t-2xl shadow-md">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-t-2xl pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white select-none">
              IEEE GUB Assistant
            </h1>
            <p className="text-xs text-green-200 mt-0.5 select-none">
              {isLoading ? 'Thinking…' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={onRetry}
                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-200 transition-all duration-200"
                aria-label="Retry last message"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onClear}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all duration-200"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {isModal && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all duration-200"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </header>
  );
}