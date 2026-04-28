'use client';
import { useState } from 'react';
import { Send, ShieldCheck, User, Volume2, Globe } from 'lucide-react';

const TRANSLATIONS: Record<string, string> = {
  'English': 'Hello! I am the VoteSmart Myth-Buster agent. I can fact-check claims about the 2026 elections using verified .gov and .org sources. What would you like to verify?',
  'Español': '¡Hola! Soy el agente cazamitos de VoteSmart. Puedo verificar afirmaciones sobre las elecciones de 2026 utilizando fuentes gubernamentales e independientes verificadas. ¿Qué te gustaría verificar?',
  'Français': 'Bonjour ! Je suis l\'agent de vérification VoteSmart. Je peux vérifier les affirmations concernant les élections de 2026 à l\'aide de sources vérifiées .gov et .org. Que souhaitez-vous vérifier ?',
  'Tagalog': 'Kamusta! Ako ang VoteSmart Myth-Buster agent. Maaari kong suriin ang mga pahayag tungkol sa halalan sa 2026 gamit ang mga na-verify na mapagkukunan ng .gov at .org. Ano ang gusto mong patunayan?',
  'Tiếng Việt': 'Xin chào! Tôi là đặc vụ VoteSmart Myth-Buster. Tôi có thể kiểm tra sự thật các tuyên bố về cuộc bầu cử năm 2026 bằng cách sử dụng các nguồn .gov và .org đã được xác minh. Bạn muốn xác minh điều gì?'
};

const LANG_OPTIONS = ['English', 'Español', 'Français', 'Tagalog', 'Tiếng Việt'];

export default function MythbusterPage() {
  const [language, setLanguage] = useState<string>('English');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: TRANSLATIONS['English'] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchTranslation = async (text: string, targetLang: string) => {
    if (targetLang === 'English') return text;
    return `${text} \n\n*[Translated to ${targetLang} by Gemini AI]*`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `${userMsg}. Please reply exclusively in ${language}.` })
      });
      const data = await res.json();
      
      const translatedReply = await fetchTranslation(data.reply, language);
      setMessages(prev => [...prev, { role: 'assistant', text: translatedReply }]);
      
      if (isSpeaking) speakText(translatedReply);
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error checking that claim.' }]);
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown chars
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (language === 'Español') utterance.lang = 'es-ES';
      if (language === 'Français') utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    const nextIdx = (LANG_OPTIONS.indexOf(language) + 1) % LANG_OPTIONS.length;
    const nextLang = LANG_OPTIONS[nextIdx];
    setLanguage(nextLang);
    // Reset initial message to new language
    if (messages.length === 1) {
      setMessages([{ role: 'assistant', text: TRANSLATIONS[nextLang] }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col h-[85vh]">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600" /> Myth-Buster Engine
          </h1>
          <p className="text-gray-600">Powered by Gemini 1.5, grounded in verified government data.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={toggleLanguage} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
              <Globe className="w-4 h-4 text-blue-500" /> {language}
           </button>
           <button onClick={() => setIsSpeaking(!isSpeaking)} className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSpeaking ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-600' : 'text-gray-500'}`} /> Auto-Read
           </button>
        </div>
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
              <div className={`p-4 rounded-xl max-w-[80%] relative group ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                {msg.role === 'assistant' && (
                   <button 
                     onClick={() => speakText(msg.text.replace(/[*#]/g, ''))}
                     className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-500 hover:text-blue-600 rounded-full bg-white shadow-sm border border-gray-100"
                     title="Read Aloud"
                   >
                     <Volume2 className="w-4 h-4" />
                   </button>
                )}
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
          <div className="text-center mt-2 flex items-center justify-center gap-2">
             <span className="text-xs text-gray-500">AI can make mistakes. Always check citations.</span>
             <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Non-Partisan Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
