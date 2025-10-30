'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Copy, Check, RotateCcw, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot({ isModal = false, onClose = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      id: Date.now(),
      sender: 'user', 
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, context: messages.slice(-10) }), // Send last 10 messages for context
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now(),
        sender: 'bot', 
        text: data.response || 'No response received',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        id: Date.now(),
        sender: 'bot', 
        text: '⚠️ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      setError(null);
    }
  };

  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.text);
        const lastBotIndex = messages.findIndex(m => m.sender === 'bot' && m.id > lastUserMessage.id);
        if (lastBotIndex !== -1) {
          setMessages(messages.slice(0, lastBotIndex));
        }
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const containerClass = isModal 
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn' 
    : 'max-w-5xl mx-auto my-8';

  const chatboxClass = isModal
    ? 'w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 animate-slideUp'
    : 'flex flex-col rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800';

  if (isModal) {
    return (
      <div className={containerClass} onClick={handleClose}>
        <div className={chatboxClass} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="relative px-6 py-4 bg-gradient-to-r from-green-700 via-green-800 to-green-700 dark:from-slate-900 dark:via-green-950 dark:to-green-950 border-b border-green-700/50 dark:border-slate-800 rounded-t-2xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-t-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    IEEE GUB Assistant
                  </h1>
                  <p className="text-xs text-green-200 mt-0.5">
                    {isLoading ? 'Thinking...' : 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <>
                    <button
                      onClick={retryLastMessage}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-200 transition-all"
                      aria-label="Retry"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearChat}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all"
                      aria-label="Clear chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          
            <>
              {/* Error Banner */}
              {error && (
                <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ⚠️ Connection error: {error}
                  </p>
                </div>
              )}

              {/* Chat Area - Scrollable */}
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
                            onClick={() => setInput(suggestion)}
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
                  <div
                    key={msg.id}
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
                                onClick={() => copyToClipboard(msg.text, idx)}
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

              {/* Input Area */}
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Ask about events, executives, or activities..."
                      rows={1}
                      disabled={isLoading}
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ minHeight: '48px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 active:scale-95 disabled:transform-none"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {input.length}/2000
                  </p>
                </div>
              </div>
            </>
         
        </div>
      </div>
    );
  }

  // Regular (non-modal) view
  return (
    <div className={chatboxClass}>
      {/* Same content as modal but without the outer wrapper */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-green-700 via-green-800 to-green-700 dark:from-slate-900 dark:via-green-950 dark:to-green-950 border-b border-green-700/50 dark:border-slate-800 rounded-t-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-t-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                IEEE GUB Assistant
              </h1>
              <p className="text-xs text-green-200 mt-0.5">
                {isLoading ? 'Thinking...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={retryLastMessage}
                  className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-200 transition-all"
                  aria-label="Retry"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ Connection error: {error}
          </p>
        </div>
      )}

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-[500px] max-h-[600px] scroll-smooth"
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
                    onClick={() => setInput(suggestion)}
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
          <div
            key={msg.id}
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
                        onClick={() => copyToClipboard(msg.text, idx)}
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

      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about events, executives, or activities..."
              rows={1}
              disabled={isLoading}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 active:scale-95 disabled:transform-none"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Press Enter to send • Shift + Enter for new line
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {input.length}/2000
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
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
      `}</style>
    </div>
  );
}