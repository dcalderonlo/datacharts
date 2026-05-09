'use client'
import { useAppStore } from '@/ui/providers/StoreProvider'
import { ExportButton } from '@/ui/molecules/ExportButton'
import { TrendArrow } from '@/ui/atoms/TrendArrow'
import { StatNumber } from '@/ui/atoms/StatNumber'

export default function ReportsPage() {
  const quotes = useAppStore((s) => s.quotes)
  const rows = Object.values(quotes)

  const exportData = rows.map((q) => ({
    Symbol: q.symbol,
    Price: q.price,
    Open: q.open,
    High: q.high,
    Low: q.low,
    'Prev Close': q.previousClose,
    Change: q.change,
    'Change %': `${q.changePercent.toFixed(2)}%`,
    Volume: q.volume,
    Date: q.latestTradingDay,
  }))

  return (
    <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Export current quote data</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton data={exportData} filename="market-report" format="csv" />
          <ExportButton data={exportData} filename="market-report" format="pdf" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-left">
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Change</th>
              <th className="px-4 py-3 font-medium text-right">Change %</th>
              <th className="px-4 py-3 font-medium text-right">Volume</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr key={q.symbol} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-blue-400">{q.symbol}</td>
                <td className="px-4 py-3 text-right">
                  <StatNumber value={q.price} format="currency" className="text-gray-100" />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="flex items-center justify-end gap-1.5">
                    <TrendArrow value={q.change} />
                    <StatNumber value={Math.abs(q.change)} format="number"
                      className={q.change >= 0 ? 'text-green-400' : 'text-red-400'} />
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${q.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {q.changePercent >= 0 ? '+' : ''}{q.changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <StatNumber value={q.volume} format="volume" className="text-gray-400" />
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{q.latestTradingDay}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No quotes yet — search for a symbol in the Overview page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
