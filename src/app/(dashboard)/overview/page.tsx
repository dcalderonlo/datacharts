import { Suspense } from 'react'
import { IndexTable } from '@/ui/organisms/IndexTable'
import { QuotePanel } from '@/ui/organisms/QuotePanel'
import { WatchlistPanel } from '@/ui/organisms/WatchlistPanel'
import { ApiErrorBoundary } from '@/ui/organisms/ApiErrorBoundary'
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
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <ApiErrorBoundary>
              <QuotePanel />
            </ApiErrorBoundary>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">My Watchlist</h2>
          <WatchlistPanel />
        </div>
      </section>
    </div>
  )
}
