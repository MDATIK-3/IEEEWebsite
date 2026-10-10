"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Bot } from "lucide-react";

const ChatbotModal = dynamic(() => import("@/app/chatbot/ChatbotModal"), {
  ssr: false,
});

export default function ChatbotButton() {
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);

  return (
    <>
      {chatbotModalOpen && (
        <ChatbotModal isOpen={chatbotModalOpen} onClose={() => setChatbotModalOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setChatbotModalOpen(true)}
          className="group relative inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 px-4 text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          aria-label="Open AI chat assistant"
          title="Open AI Chat"
        >
          <span className="pointer-events-none absolute -inset-1 rounded-full border border-emerald-200/50" />
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-emerald-500/25 blur-md" />
          <Bot className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative text-sm font-semibold tracking-wide">AI Chat</span>
        </button>
      </div>
    </>
  );
}
