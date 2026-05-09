'use client'
import { useAppStore } from '@/ui/providers/StoreProvider'
import { SearchBar } from '@/ui/molecules/SearchBar'
import { MetricCard } from '@/ui/molecules/MetricCard'
import { AlertBanner } from '@/ui/molecules/AlertBanner'
import { StatNumber } from '@/ui/atoms/StatNumber'
import { Badge } from '@/ui/atoms/Badge'

export function QuotePanel() {
  const fetchQuote = useAppStore((s) => s.fetchQuote)
  const quotes = useAppStore((s) => s.quotes)
  const isLoadingQuote = useAppStore((s) => s.isLoadingQuote)
  const error = useAppStore((s) => s.error)

  // Show the most recently searched quote (last key)
  const symbols = Object.keys(quotes)
  const activeSymbol = symbols[symbols.length - 1]
  const quote = activeSymbol ? quotes[activeSymbol] : null

  return (
    <div className="flex flex-col gap-4">
      <SearchBar onSearch={fetchQuote} placeholder="Search symbol (e.g. AAPL)" isLoading={isLoadingQuote} />

      {error && <AlertBanner message={error} type="error" />}

      {quote && (
        <div className="flex flex-col gap-4">
          <MetricCard
            title={`${quote.symbol} — Price`}
            value={quote.price}
            change={quote.change}
            changePercent={quote.changePercent}
            format="currency"
          />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
              <span className="text-gray-500">Open</span>
              <StatNumber value={quote.open} format="currency" className="text-gray-100" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
              <span className="text-gray-500">Previous Close</span>
              <StatNumber value={quote.previousClose} format="currency" className="text-gray-100" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
              <span className="text-gray-500">High</span>
              <StatNumber value={quote.high} format="currency" className="text-gray-100" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
              <span className="text-gray-500">Low</span>
              <StatNumber value={quote.low} format="currency" className="text-gray-100" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1 col-span-2">
              <span className="text-gray-500">Volume</span>
              <StatNumber value={quote.volume} format="volume" className="text-gray-100" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="info">{quote.latestTradingDay}</Badge>
          </div>
        </div>
      )}

      {!quote && !isLoadingQuote && !error && (
        <p className="text-gray-500 text-sm text-center py-8">Search for a symbol to see live data.</p>
      )}
    </div>
  )
}
