'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import ChatArea from './ChatArea';
import ChatInput from './ChatInput';
import ErrorBanner from './ErrorBanner';
import ChatStyles from './ChatStyles';

function createMessage(sender, text, isError = false) {
  const hasUUID = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
  return {
    id: hasUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    sender,
    text,
    timestamp: new Date().toISOString(),
    isError,
  };
}

export default function ChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState(null);
  const [lastUserText, setLastUserText] = useState('');

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEsc);
      abortControllerRef.current?.abort();
    };
  }, [isOpen, onClose]);

  const sendMessage = async (value = input) => {
    const text = value.trim();
    if (!text || isLoading) return;

    const userMessage = createMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    setLastUserText(text);
    setInput('');
    setIsLoading(true);
    setError(null);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          query: text,
          context: [...messages.slice(-9), userMessage],
        }),
        signal: abortControllerRef.current.signal,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || `Request failed (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        createMessage('bot', payload?.response || 'No response received.'),
      ]);
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;

      const message = requestError?.message || 'Unable to connect to chat service.';
      setError(message);
      setMessages((prev) => [
        ...prev,
        createMessage('bot', 'Sorry, I encountered an error. Please try again.', true),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (copyError) {
      console.error('Failed to copy message:', copyError);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const retryLastMessage = () => {
    if (!lastUserText || isLoading) return;
    sendMessage(lastUserText);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="IEEE GUB chatbot"
    >
      <div
        className="chat-panel relative flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-2xl dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:h-[85vh] sm:max-w-4xl sm:rounded-3xl animate-slideUp"
        onClick={(event) => event.stopPropagation()}
      >
        <ChatHeader
          isModal
          isLoading={isLoading}
          messages={messages}
          onRetry={retryLastMessage}
          onClear={clearChat}
          onClose={onClose}
        />

        {error && <ErrorBanner error={error} />}

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          copiedId={copiedId}
          onCopy={copyToClipboard}
          onSuggestion={setInput}
          onSendSuggestion={sendMessage}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          isLoading={isLoading}
        />

        <span className="sr-only" aria-live="polite">
          {isLoading ? 'Assistant is typing' : ''}
        </span>

        <ChatStyles />
      </div>
    </div>
  );
}
