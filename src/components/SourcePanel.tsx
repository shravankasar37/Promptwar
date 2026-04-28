'use client';
import { ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface SourceCardData {
  id: string;
  title: string;
  url: string;
  type: 'verified' | 'unverified';
  snippet: string;
}

interface SourcePanelProps {
  sources: SourceCardData[];
}

export default function SourcePanel({ sources }: SourcePanelProps) {
  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
           <ExternalLink className="w-5 h-5 text-indigo-600" /> Evidence Sidebar
        </h3>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-200/50 px-2 py-1 rounded">Live Verification</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
             <ShieldAlert className="w-10 h-10 opacity-20" />
             <p className="text-sm text-center px-4">Sources will appear here automatically when the AI references external data.</p>
          </div>
        ) : (
          sources.map(source => (
            <a 
              key={source.id} 
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{source.title}</h4>
                {source.type === 'verified' && (
                  <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 mb-2 line-clamp-2">{source.snippet}</p>
              <div className="text-[10px] text-slate-400 truncate w-full flex items-center gap-1">
                 <ExternalLink className="w-3 h-3" /> {new URL(source.url).hostname}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
