'use client';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, Bell } from 'lucide-react';

export default function DeadlinesPage() {
  const deadlines = [
    { id: 1, date: 'Oct 5, 2026', title: 'Voter Registration Deadline', status: 'upcoming', type: 'registration' },
    { id: 2, date: 'Oct 19, 2026', title: 'Early Voting Begins', status: 'upcoming', type: 'voting' },
    { id: 3, date: 'Oct 30, 2026', title: 'Mail-in Ballot Request Deadline', status: 'upcoming', type: 'mail' },
    { id: 4, date: 'Nov 3, 2026', title: 'Election Day', status: 'critical', type: 'voting' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">2026 Election Deadlines</h1>
          <p className="text-gray-600">Your personalized timeline for Austin, Texas.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Bell className="w-4 h-4" /> Enable Alerts
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>
        <div className="p-6">
          <div className="space-y-8">
            {deadlines.map((item, idx) => (
              <div key={item.id} className="relative flex items-start gap-6 md:gap-8">
                <div className="hidden md:flex flex-col items-center z-10 shrink-0">
                  <div className={`w-4 h-4 rounded-full mt-1.5 ${item.status === 'critical' ? 'bg-red-500 ring-4 ring-red-100' : 'bg-blue-500 ring-4 ring-blue-100'}`}></div>
                </div>
                <div className={`flex-1 border rounded-xl p-5 md:p-6 transition-all hover:shadow-md ${item.status === 'critical' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <CalendarIcon className={`w-4 h-4 ${item.status === 'critical' ? 'text-red-500' : 'text-blue-500'}`} />
                        <span className={item.status === 'critical' ? 'text-red-600' : 'text-blue-600'}>{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">Save this date to ensure you meet all state requirements.</p>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <button className="text-sm border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
