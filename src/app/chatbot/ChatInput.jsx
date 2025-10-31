import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function ChatInput({ input = '', setInput, onSend, isLoading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about events, executives, or activities..."
            rows={1}
            disabled={isLoading}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '48px' }}
            aria-label="Chat input field"
          />
        </div>

        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-105 active:scale-95 disabled:transform-none"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {input.length}/2000
        </p>
      </div>
    </footer>
  );
}