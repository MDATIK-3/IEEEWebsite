"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import Chatbot from "../../chatbot/page";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feedback");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, email }),
      });

      if (response.ok) {
        setIsSent(true);
        setMessage("");
        setEmail("");
        setTimeout(() => {
          setIsSent(false);
          setIsOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleChatbotOpen = () => {
    setChatbotModalOpen(true);
    setIsOpen(false);
  };

  const handleChatbotClose = () => {
    setChatbotModalOpen(false);
  };

  return (
    <>
      {/* Chatbot Modal - Now properly integrated */}
      {chatbotModalOpen && (
        <Chatbot isModal={true} onClose={handleChatbotClose} />
      )}

      {/* Feedback/Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {isOpen ? (
          <div 
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto"
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "feedback"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Feedback
                </button>
                <button
                  onClick={handleChatbotOpen}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all  dark:bg-gray-200 text-green-700 hover:bg-gray-200 shadow-md flex items-center gap-2"
                >
                  <Bot size={16} />
                  AI Chat
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {activeTab === "feedback" && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">
                  Share Your Thoughts
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We'd love to hear from you!
                </p>
                
                {isSent ? (
                  <div 
                    className="text-emerald-600 dark:text-emerald-400 py-8 text-center"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-semibold text-lg mb-2">Thank you for your feedback!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">We appreciate your input.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        How can we improve?
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        maxLength={1000}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all resize-none"
                        placeholder="Share your experience, suggestions, or report any issues..."
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        {message.length}/1000
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        Your Email{" "}
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending || !message.trim()}
                      className="w-full px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center shadow-md"
                    >
                      {isSending ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send size={18} className="mr-2" />
                          Send Feedback
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group relative"
            aria-label="Open feedback and chatbot"
          >
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
      `}} />
    </>
  );
}