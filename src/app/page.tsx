'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck, User, Volume2, Globe, Sparkles, MapPin, Calendar, FileText, ArrowRight, Activity, FileCheck2 } from 'lucide-react';
import SourcePanel, { SourceCardData } from '@/components/SourcePanel';
import BallotAnimation from '@/components/BallotAnimation';

export default function CommandCenter() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome to the VoteSmart Command Center. I am your neutral Election Official AI. You can ask me about registration, voting locations, candidate comparisons, or to fact-check an election claim.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<'en'|'es'|'fr'|'tl'|'vi'>('en');
  const [sources, setSources] = useState<SourceCardData[]>([]);

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    tl: 'Tagalog',
    vi: 'Tiếng Việt'
  };
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop speech when the component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (e: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = customMsg || input;
    if (!userMsg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const languageInstruction = language === 'en' ? '' : ` [CRITICAL INSTRUCTION: You must output your entire response in ${languageNames[language]} language.]`;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg + languageInstruction })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      
      // If the API returns evidence sources, update the right panel
      if (data.sources && data.sources.length > 0) {
        setSources(prev => {
          const newSources = [...prev];
          data.sources.forEach((s: SourceCardData) => {
             if (!newSources.find(ns => ns.id === s.id)) newSources.push(s);
          });
          return newSources;
        });
      }

      if (isSpeaking) speakText(data.reply);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'System Error: Unable to reach verification servers.' }]);
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#|-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerAction = (promptText: string) => {
    handleSend(null as any, promptText);
  };

  return (
    <div className="bg-offwhite min-h-[calc(100vh-4rem)] flex flex-col font-sans">
      
      {/* Contextual Header (Status Bar) */}
      <div className="bg-navy text-white px-6 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <Activity className="w-5 h-5 text-success-green animate-pulse" />
             <span className="font-semibold text-sm tracking-wide uppercase text-slate-300">System Status: <span className="text-success-green">Verified Active</span></span>
           </div>
           <div className="h-4 border-l border-slate-600"></div>
           <div className="flex items-center gap-2 text-sm text-slate-300">
             <MapPin className="w-4 h-4" /> Detected Region: <strong className="text-white">Texas (District 14)</strong>
           </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="bg-slate-800/80 px-3 py-1 rounded border border-slate-700 text-slate-300">
            <span className="text-white">Next Deadline:</span> Oct 5 (Registration)
          </div>
          <div className="bg-blue-900/50 px-3 py-1 rounded border border-blue-800 text-blue-200">
            Days to Election: <span className="font-bold text-white text-base">553</span>
          </div>
        </div>
      </div>

      {/* 3-Column Split Pane */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden h-[calc(100vh-8rem)]">
        
        {/* LEFT: Action Panel */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
             <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-indigo-600"/> Quick Actions</h3>
             <div className="space-y-3">
               <button onClick={() => triggerAction("Help me pre-fill my voter registration form for Texas.")} className="w-full text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-3 rounded-lg transition-all text-sm font-medium text-slate-700 flex items-center justify-between group">
                 Registration Pre-Fill <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
               </button>
               <button onClick={() => triggerAction("Compare Candidate A and Candidate B side-by-side.")} className="w-full text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-3 rounded-lg transition-all text-sm font-medium text-slate-700 flex items-center justify-between group">
                 Candidate Duel (A vs B) <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
               </button>
               <button onClick={() => triggerAction("Explain Proposition A like I'm in high school.")} className="w-full text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-3 rounded-lg transition-all text-sm font-medium text-slate-700 flex items-center justify-between group">
                 Simplify Ballot Measure <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
               </button>
             </div>
          </div>
          
          <div className="hidden lg:block">
            <BallotAnimation />
          </div>
        </div>

        {/* CENTER: AI Workspace */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden relative">
           {/* Header Controls */}
           <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center z-10">
              <h2 className="font-bold text-navy flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Workspace
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Globe className="w-3.5 h-3.5" /> {languageNames[language]}
                  </button>
                  <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1 w-32">
                    {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map(lang => (
                      <button key={lang} onClick={() => setLanguage(lang)} className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsSpeaking(!isSpeaking)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${isSpeaking ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 border'}`}>
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} /> {isSpeaking ? 'Audio On' : 'Audio Off'}
                </button>
              </div>
           </div>
           
           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 bg-navy rounded-full flex justify-center items-center shrink-0 shadow-sm mt-1">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base max-w-[85%] relative group transition-all duration-300 ${msg.role === 'user' ? 'bg-navy text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm prose prose-sm max-w-none prose-a:text-indigo-600'}`}>
                    <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-9 h-9 bg-slate-200 rounded-full flex justify-center items-center shrink-0 border border-slate-300 mt-1">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                 <div className="flex gap-4">
                   <div className="w-9 h-9 bg-navy rounded-full flex justify-center items-center shrink-0 shadow-sm mt-1">
                      <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                   <div className="p-4 rounded-2xl shadow-sm bg-white border border-slate-200 rounded-tl-sm flex items-center gap-1.5 h-12">
                     <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                     <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
                   </div>
                 </div>
              )}
              <div ref={chatEndRef} />
           </div>
           
           {/* Input Area */}
           <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a non-partisan question..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3.5 pl-4 pr-14 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="absolute right-2 bg-navy hover:bg-indigo-800 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
           </div>
        </div>

        {/* RIGHT: Evidence Sidebar */}
        <div className="lg:col-span-3 h-full">
           <SourcePanel sources={sources} />
        </div>
        
      </div>
    </div>
  );
}
