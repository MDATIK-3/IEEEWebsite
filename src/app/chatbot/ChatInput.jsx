import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function ChatInput({ input = '', setInput, onSend, isLoading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  }, [input]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="border-t border-slate-200/90 bg-white/95 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-4 sm:py-4 sm:rounded-b-3xl">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about events, executives, or activities..."
            rows={1}
            disabled={isLoading}
            maxLength={2000}
            className="min-h-12 w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 sm:px-4 sm:py-3 sm:text-base"
            aria-label="Chat input field"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-3 text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none dark:disabled:from-slate-700 dark:disabled:to-slate-800"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-2 flex items-center justify-between px-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">Enter to send, Shift+Enter for newline</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{input.length}/2000</p>
      </div>
    </footer>
  );
}
