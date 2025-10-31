'use client';

import { useState, useRef, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import ErrorBanner from './components/ErrorBanner';
import ChatStyles from './components/ChatStyles';

export default function Chatbot({ isModal = false, onClose = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        body: JSON.stringify({ query: input, context: messages.slice(-10) }),
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    window.setInputFromSuggestion = setInput;
    return () => {
      delete window.setInputFromSuggestion;
    };
  }, []);

  const containerClass = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn'
    : '';

  const chatboxClass = isModal
    ? 'w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 animate-slideUp'
    : '';

  if (isModal) {
    return (
      <div className={containerClass} onClick={handleClose}>
        <div className={chatboxClass} onClick={(e) => e.stopPropagation()}>
          <ChatHeader
            isModal={isModal}
            isLoading={isLoading}
            messages={messages}
            onRetry={retryLastMessage}
            onClear={clearChat}
            onClose={handleClose}
          />

          {error && <ErrorBanner error={error} />}
          
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            copiedIndex={copiedIndex}
            onCopy={copyToClipboard}
            chatContainerRef={chatContainerRef}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            isLoading={isLoading}
          />

          <ChatStyles />
        </div>
      </div>
    );
  }
  return (
    <div>Testing</div>
  )
}
