import { Trash2, RotateCcw, Sparkles, X } from 'lucide-react';

export default function ChatHeader({ isModal, isLoading, messages = [], onRetry, onClear, onClose }) {
  return (
    <header className="relative overflow-hidden border-b border-emerald-800/30 rounded-none bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 px-4 py-3 shadow-md dark:border-emerald-900/40 dark:from-emerald-950 dark:via-teal-950 dark:to-slate-950 sm:rounded-t-3xl sm:px-6 sm:py-4">
      <div className="pointer-events-none absolute inset-0 rounded-none bg-grid-pattern opacity-10 sm:rounded-t-3xl" />
      <div className="pointer-events-none absolute -left-20 -top-16 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-md ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-emerald-100 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="select-none text-lg font-semibold tracking-tight text-white sm:text-xl">
              IEEE GUB Assistant
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-emerald-100 ring-1 ring-white/20">
                <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-300' : 'bg-emerald-300'}`} />
                {isLoading ? 'Generating' : 'Online'}
              </span>
              <p className="select-none text-xs text-emerald-100/90">{messages.length} messages</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={onRetry}
                className="rounded-lg bg-white/10 p-2 text-emerald-100 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Retry last message"
                title="Retry"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onClear}
                className="rounded-lg bg-rose-400/20 p-2 text-rose-100 transition hover:bg-rose-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/70"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          {isModal && (
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Close chatbot"
              title="Close"
            >
              <X className="h-4 w-4" />
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
