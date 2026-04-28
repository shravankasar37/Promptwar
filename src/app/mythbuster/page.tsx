'use client';
import { useState } from 'react';
import { Send, ShieldCheck, User } from 'lucide-react';

export default function MythbusterPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am the VoteSmart Myth-Buster agent. I can fact-check claims about the 2026 elections using verified .gov and .org sources. What would you like to verify?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Endpoint to our actual AI backend we will build next
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error checking that claim.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col h-[85vh]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-green-600" /> Myth-Buster Engine
        </h1>
        <p className="text-gray-600">Powered by Gemini 1.5, grounded in verified government data to combat misinformation.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex justify-center items-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
              )}
              <div className={`p-4 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                {/* Normally we will render markdown here so citations show nicely */}
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex gap-4">
               <div className="w-8 h-8 bg-green-100 rounded-full flex justify-center items-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
               </div>
               <div className="p-4 rounded-xl bg-gray-100 text-gray-800 rounded-tl-none flex items-center gap-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
               </div>
             </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Do I need a Photo ID to vote in Texas?"
              className="flex-1 bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex justify-center items-center transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-gray-500">
            AI can make mistakes. Always check citations.
          </div>
        </div>
      </div>
    </div>
  );
}
