'use client';
import { useState, useEffect } from 'react';
import { Send, ShieldCheck, User, Volume2, Globe, Sparkles } from 'lucide-react';

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

  // Stop speech when the component unmounts (changing pages)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    if (messages.length === 1) {
      setMessages([{ role: 'assistant', text: TRANSLATIONS[nextLang] }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col h-[85vh]">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2 flex items-center gap-3 drop-shadow-sm">
            <Sparkles className="w-8 h-8 text-indigo-500" /> Myth-Buster AI Engine
          </h1>
          <p className="text-slate-600 font-medium">Powered by Gemini 2.5 Flash. Grounded strictly in verified government data.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={toggleLanguage} className="flex flex-row items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-indigo-500">
              <Globe className="w-4 h-4 text-indigo-500" /> {language}
           </button>
           <button onClick={() => setIsSpeaking(!isSpeaking)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${isSpeaking ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' : 'bg-white/70 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-slate-50'}`}>
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`} /> Auto-Read
           </button>
        </div>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden flex flex-col ring-1 ring-slate-900/5">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-200 shadow-inner rounded-full flex justify-center items-center shrink-0 border border-indigo-200 ring-2 ring-white">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                </div>
              )}
              <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] relative group transition-all duration-300 ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm hover:shadow-md hover:-translate-y-0.5' : 'bg-white/80 border border-slate-100 text-slate-800 rounded-tl-sm hover:shadow-md'}`}>
                <div className="leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
                {msg.role === 'assistant' && (
                   <button 
                     onClick={() => speakText(msg.text.replace(/[*#]/g, ''))}
                     className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 text-slate-400 hover:text-indigo-600 rounded-full bg-white shadow-md border border-slate-100"
                     title="Read Aloud"
                   >
                     <Volume2 className="w-4 h-4" />
                   </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center shrink-0 border border-gray-200">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex gap-4 animation-fade-in">
               <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-200 shadow-inner rounded-full flex justify-center items-center shrink-0 border border-indigo-200">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
               </div>
               <div className="p-5 rounded-2xl shadow-sm bg-white/80 border border-slate-100 rounded-tl-sm flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 bg-indigo-400/80 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-indigo-500/80 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                 <div className="w-2.5 h-2.5 bg-indigo-600/80 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
               </div>
             </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50/50 backdrop-blur-md border-t border-slate-200/60 z-10">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Do I need a Photo ID to vote in Texas?"
              className="flex-1 bg-white border border-slate-300/80 shadow-inner rounded-xl py-4 px-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white p-4 rounded-xl flex justify-center items-center transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          <div className="text-center mt-3 flex items-center justify-center gap-3">
             <span className="text-xs font-semibold text-slate-500">AI can make mistakes. Always check citations.</span>
             <span className="bg-emerald-100 text-emerald-800 text-[10px] tracking-wider font-extrabold px-2 py-0.5 rounded uppercase shadow-sm">Non-Partisan Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
