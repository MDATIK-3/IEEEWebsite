import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ msg, copiedId, onCopy }) {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {!isUser && (
        <div className="mb-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-semibold text-white shadow sm:flex">
          AI
        </div>
      )}
      <div
        className={`group max-w-[92%] sm:max-w-[80%] ${
          isUser
            ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md'
            : `${
                msg.isError
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : 'border-slate-200 bg-white/95 shadow-md dark:border-slate-700 dark:bg-slate-800/95'
              } rounded-2xl rounded-bl-md border text-slate-900 dark:text-slate-100`
        }`}
      >
        <div className="px-3 py-3 sm:px-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold opacity-75">{isUser ? 'You' : 'IEEE Assistant'}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">{formatTime(msg.timestamp)}</span>
              {!isUser && (
                <button
                  onClick={() => onCopy(msg.text, msg.id)}
                  className="rounded p-1 opacity-100 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-slate-700"
                  aria-label="Copy message"
                >
                  {copiedId === msg.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="break-words text-sm leading-relaxed">
            {isUser ? (
              <div className="whitespace-pre-wrap">{msg.text}</div>
            ) : (
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="ml-4 list-disc space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1">{children}</ol>,
                  code: ({ children }) => (
                    <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                      {children}
                    </code>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || 'Image'}
                      className="my-2 max-h-56 w-auto rounded-lg border border-slate-300 dark:border-slate-700"
                      loading="lazy"
                    />
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
