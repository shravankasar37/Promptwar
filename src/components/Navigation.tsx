import Link from 'next/link';
import { Globe, MapPin, Calendar, FileText, Search } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex bg-navy">
            <div className="flex-shrink-0 flex items-center bg-navy gap-2">
              <span className="text-2xl font-bold tracking-tight">VoteSmart '26</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 bg-navy">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-white text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1" /> Command Center
              </Link>
              <Link href="/deadlines" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-gray-300 hover:text-white text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1" /> Full Calendar
              </Link>
              <Link href="/ballot" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-gray-300 hover:text-white text-sm font-medium">
                <FileText className="w-4 h-4 mr-1" /> Local Sandbox
              </Link>
            </div>
          </div>
          <div className="flex items-center bg-navy">
            <button className="flex items-center text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded px-3 py-1 transition-colors">
              <Globe className="w-4 h-4 mr-2" />
              English
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
