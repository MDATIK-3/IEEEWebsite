import { Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTIONS = ['Upcoming events', 'Executive board', 'How to join', 'Contact information'];

export default function ChatArea({
  messages,
  isLoading,
  copiedId,
  onCopy,
  onSuggestion,
  onSendSuggestion,
  messagesEndRef,
}) {
  return (
    <div className="relative flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6 scroll-smooth">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-100/90 to-transparent dark:from-slate-900/70" />
      {messages.length === 0 && (
        <div className="flex h-full min-h-[280px] items-center justify-center">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/75">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg sm:h-20 sm:w-20">
              <Sparkles className="h-8 w-8 text-white sm:h-10 sm:w-10" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl text-balance">
              Welcome to IEEE GUB Assistant
            </h2>
            <p className="mb-5 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Ask about events, leadership, membership, or chapter activity.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    onSuggestion?.(suggestion);
                    onSendSuggestion?.(suggestion);
                  }}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 hover:shadow dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage key={msg.id} msg={msg} copiedId={copiedId} onCopy={onCopy} />
      ))}

      {isLoading && (
        <div className="flex justify-start animate-fadeIn">
          <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex gap-1.5">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-emerald-600"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-emerald-600"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-emerald-600"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
