import { Suspense } from 'react'
import { IndexTable } from '@/ui/organisms/IndexTable'
import { QuotePanel } from '@/ui/organisms/QuotePanel'
import { WatchlistPanel } from '@/ui/organisms/WatchlistPanel'
import { ApiErrorBoundary } from '@/ui/organisms/ApiErrorBoundary'
import { Card } from '@/ui/atoms/Card'
import { Spinner } from '@/ui/atoms/Spinner'

export default function OverviewPage() {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Market Overview</h1>
        <p className="text-gray-500 text-sm mt-1">{now}</p>
      </div>

      {/* KPI Row — placeholder cards; real data comes from QuotePanel searches */}
      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'S&P 500', value: 5248.94, change: 18.5, pct: 0.35 },
            { title: 'NASDAQ', value: 16400.2, change: -42.1, pct: -0.25 },
            { title: 'DOW JONES', value: 39142.3, change: 102.4, pct: 0.26 },
            { title: 'Russell 2000', value: 2062.1, change: -8.4, pct: -0.4 },
          ].map((kpi) => {
            const isPos = kpi.change >= 0
            return (
              <Card key={kpi.title} className="flex flex-col gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{kpi.title}</p>
                <p className="text-xl font-mono font-semibold text-white">
                  {kpi.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                  {isPos ? '+' : ''}{kpi.change.toFixed(2)} ({isPos ? '+' : ''}{kpi.pct.toFixed(2)}%)
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Index Table */}
      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Global Indices</h2>
        <Suspense fallback={<div className="flex justify-center py-8"><Spinner size="lg" /></div>}>
          <ApiErrorBoundary>
            <IndexTable />
          </ApiErrorBoundary>
        </Suspense>
      </section>

      {/* Quote + Watchlist row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Live Quote</h2>
          <Card>
            <ApiErrorBoundary>
              <QuotePanel />
            </ApiErrorBoundary>
          </Card>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">My Watchlist</h2>
          <WatchlistPanel />
        </div>
      </section>
    </div>
  )
}
