// app/chatbot/page.js
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: 'You', text: input }]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'Bot', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'Bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>IEEE GUB Chatbot</h1>
      <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
            marginBottom: '10px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.sender === 'You' ? '#007bff' : '#e9ecef',
              color: msg.sender === 'You' ? '#fff' : '#000',
              wordWrap: 'break-word'
            }}>
              <strong>{msg.sender}:</strong>
              <div style={{ marginTop: '5px' }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about events or executives..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px 0 0 5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
}
