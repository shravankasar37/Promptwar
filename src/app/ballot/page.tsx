export default function BallotPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Virtual Ballot</h1>
      <p className="text-gray-600 mb-8">Review your candidates and state propositions down-ballot.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-1">State Elections</h2>
          <p className="text-sm text-gray-500">Texas • Nov 3, 2026</p>
        </div>
        <div className="p-6">
          {/* Mockup for Ballot */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h3 className="uppercase tracking-wide text-xs font-bold text-gray-500 mb-4">Governor</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="gov" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div className="flex-1">
                  <p className="font-semibold">Candidate A</p>
                  <p className="text-sm text-gray-500">Party affiliation</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">View Stance</button>
                  <button className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">Endorsements</button>
                </div>
              </label>
              
              <label className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="gov" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div className="flex-1">
                  <p className="font-semibold">Candidate B</p>
                  <p className="text-sm text-gray-500">Party affiliation</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">View Stance</button>
                  <button className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">Endorsements</button>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
