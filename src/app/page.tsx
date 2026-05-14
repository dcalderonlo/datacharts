import { PublicNavBar } from '@/ui/organisms/PublicNavBar'
import { LandingSearch } from '@/ui/organisms/LandingSearch'

const PREVIEW_INDICES = [
  { name: 'S&P 500', value: '5,248.94', change: '+0.35%', positive: true },
  { name: 'NASDAQ', value: '16,400.20', change: '-0.25%', positive: false },
  { name: 'DOW JONES', value: '39,142.30', change: '+0.26%', positive: true },
]

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PublicNavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">dataCharts</h1>
        <p className="text-xl text-gray-400 mb-10">
          Real-time market data, portfolio watchlists, and price alerts — all in one place.
        </p>

        {/* Anonymous search */}
        <LandingSearch />

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Create Account
          </a>
        </div>
      </section>

      {/* Market indices preview */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">
          Live Market Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PREVIEW_INDICES.map((idx) => (
            <div
              key={idx.name}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center"
            >
              <p className="text-sm text-gray-400 mb-1">{idx.name}</p>
              <p className="text-2xl font-bold text-white">{idx.value}</p>
              <p className={`text-sm mt-1 font-medium ${idx.positive ? 'text-green-400' : 'text-red-400'}`}>
                {idx.change}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
