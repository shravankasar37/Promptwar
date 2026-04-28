'use client';
import { useState } from 'react';
import { Search, MapPin, Building2, ExternalLink } from 'lucide-react';

export default function BallotPage() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchBallot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/civic?address=${encodeURIComponent(address)}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Virtual Ballot</h1>
      <p className="text-gray-600 mb-8">Enter your address to pull your specific local candidates and referendums natively.</p>

      <form onSubmit={fetchBallot} className="mb-8 flex gap-3 max-w-2xl bg-white p-2 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 flex items-center px-3 gap-2">
          <MapPin className="text-blue-500 w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="Enter full address or Zip Code (e.g., 90210 CA or 33101 FL)" 
            className="w-full bg-transparent border-none focus:ring-0 text-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:bg-blue-400">
          {loading ? 'Searching...' : 'Find My Ballot'}
        </button>
      </form>

      {data && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 animation-fade-in">
          <div className="border-b border-gray-200 p-6 bg-slate-50 flex justify-between items-center rounded-t-xl">
            <div>
              <h2 className="text-xl font-semibold mb-1 flex items-center justify-start gap-2">
                 <Building2 className="w-5 h-5 text-gray-500" />
                 {data.state?.[0]?.name || 'Local'} Elections
              </h2>
              <p className="text-sm text-gray-500 font-medium">{data.stateInfo}</p>
            </div>
          </div>
          <div className="p-6 divide-y divide-gray-100">
            {data.contests?.map((contest: any, idx: number) => (
              <div key={idx} className="py-6 first:pt-2">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                    {contest.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{contest.office || contest.referendumTitle}</h3>
                  {contest.referendumSubtitle && <p className="text-sm text-gray-600 mt-1">{contest.referendumSubtitle}</p>}
                </div>
                
                <div className="space-y-3">
                  {contest.candidates?.map((cand: any, cidx: number) => (
                    <label key={cidx} className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="radio" name={`contest-${idx}`} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{cand.name}</p>
                        <p className="text-sm text-gray-500">{cand.party}</p>
                      </div>
                      <div className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-600 font-medium hover:bg-gray-200">
                        View Bio
                      </div>
                    </label>
                  ))}
                  {contest.sources?.[0] && (
                     <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                       Verified via {contest.sources[0].name} <ExternalLink className="w-3 h-3" />
                     </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
