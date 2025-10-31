import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ msg, idx, copiedIndex, onCopy }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div
        className={`group max-w-[80%] ${
          msg.sender === 'user'
            ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl rounded-br-md shadow-md'
            : `${msg.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md'} text-slate-900 dark:text-slate-100 border rounded-2xl rounded-bl-md`
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold opacity-75">
              {msg.sender === 'user' ? 'You' : 'IEEE Assistant'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">
                {formatTime(msg.timestamp)}
              </span>
              {msg.sender === 'bot' && (
                <button
                  onClick={() => onCopy(msg.text, idx)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Copy message"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="text-sm leading-relaxed break-words">
            {msg.sender === 'bot' ? (
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="ml-4">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{msg.text}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
