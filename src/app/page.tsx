'use client';
import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import BallotAnimation from '@/components/BallotAnimation';

export default function Home() {
  const [location, setLocation] = useState('Detecting...');
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    // Simulate IP Geolocation delay
    const timer = setTimeout(() => {
      setLocation('Austin, Texas (78701)');
      // Mock localized candidate data
      setCandidates([
        { id: 1, type: 'State Representative', name: 'Maria Rodriguez', party: 'Independent', inc: false },
        { id: 2, type: 'Mayor', name: 'James Thompson', party: 'Non-Partisan', inc: true },
        { id: 3, type: 'Proposition A', name: 'City Transit Expansion', status: 'On Ballot' }
      ]);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BallotAnimation />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-blue-200" />
            <h1 className="text-2xl font-semibold">Your 2026 Local Actions</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Based on your detected location: <span className="font-bold text-white bg-blue-800/50 px-2 py-1 rounded inline-block ml-1">{location}</span>
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 flex flex-col items-start h-full">
            <h3 className="font-semibold text-lg mb-2 text-blue-900 flex items-center">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 border border-blue-300">1</span>
              Next Deadline
            </h3>
            <p className="text-xl font-bold mb-1">Oct 5, 2026</p>
            <p className="text-sm text-gray-600 mb-4">Voter Registration Closes</p>
            <Link href="/deadlines" className="mt-auto text-blue-700 hover:text-blue-900 font-medium flex items-center text-sm">
              View all deadlines <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-red-50 rounded-lg p-5 border border-red-100 flex flex-col items-start h-full">
            <h3 className="font-semibold text-lg mb-2 text-red-900 flex items-center">
              <span className="bg-red-200 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 border border-red-300">2</span>
              Trending Issue
            </h3>
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-900">Misinformation detected regarding Proposition A voting methods.</p>
            </div>
            <Link href="/mythbuster" className="mt-auto text-red-700 hover:text-red-900 font-medium flex items-center text-sm">
              Fact-check now <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border border-green-100 flex flex-col items-start h-full">
            <h3 className="font-semibold text-lg mb-2 text-green-900 flex items-center">
              <span className="bg-green-200 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 border border-green-300">3</span>
              Voting Status
            </h3>
            <p className="font-bold flex items-center gap-2 mb-1">
              <UserCheck className="w-5 h-5 text-green-600" /> Registered
            </p>
            <p className="text-sm text-gray-600 mb-4">You are eligible to vote at Austin City Hall.</p>
            <button className="mt-auto text-green-700 hover:text-green-900 font-medium flex items-center text-sm">
              Update status <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Local Ballot (Preview)</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {candidates.length > 0 ? candidates.map((item) => (
          <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{item.type}</p>
              <p className="text-lg font-semibold text-gray-900">{item.name}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center gap-4">
              <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                {item.party || item.status}
              </span>
              <button className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-medium text-sm border border-blue-200 transition-colors">
                View Stances
              </button>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
               <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
