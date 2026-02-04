import { Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

export default function ChatArea({
  messages,
  isLoading,
  copiedIndex,
  onCopy,
  chatContainerRef,
  messagesEndRef
}) {
  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      style={{ minHeight: '400px' }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
              Welcome to IEEE GUB Assistant
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Ask me anything about IEEE GUB events, executives, or activities
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Upcoming events', 'Executive board', 'How to join'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    if (window.setInputFromSuggestion) {
                      window.setInputFromSuggestion(suggestion);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm transition-all hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <ChatMessage
          key={msg.id}
          msg={msg}
          idx={idx}
          copiedIndex={copiedIndex}
          onCopy={onCopy}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
