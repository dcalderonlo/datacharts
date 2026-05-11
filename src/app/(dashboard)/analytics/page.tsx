'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import type { ChartData } from 'chart.js'
import { Spinner } from '@/ui/atoms/Spinner'

const MarketChart = dynamic(
  () => import('@/ui/organisms/MarketChart').then((m) => ({ default: m.MarketChart })),
  { ssr: false }
)

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']

const SECTOR_DATA: ChartData<'doughnut'> = {
  labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'],
  datasets: [
    {
      data: [32, 18, 22, 14, 14],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    },
  ],
}

interface VolatilityData {
  symbol: string
  beta: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
}

export default function AnalyticsPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [volatility, setVolatility] = useState<VolatilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const r = await fetch(`/api/market/volatility?symbol=${symbol}`)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json = await r.json()
        setVolatility(json.data)
      } catch {
        setError('Failed to load volatility data')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [symbol])

  const rangeData: ChartData<'bar'> | null = volatility
    ? {
        labels: [volatility.symbol],
        datasets: [
          {
            label: '52W Low',
            data: [volatility.fiftyTwoWeekLow],
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderColor: '#ef4444',
            borderWidth: 1,
          },
          {
            label: '52W High',
            data: [volatility.fiftyTwoWeekHigh],
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderColor: '#10b981',
            borderWidth: 1,
          },
        ],
      }
    : null

  const betaData: ChartData<'bar'> | null = volatility
    ? {
        labels: [volatility.symbol],
        datasets: [
          {
            label: 'Beta',
            data: [volatility.beta],
            backgroundColor: 'rgba(139,92,246,0.7)',
            borderColor: '#7c3aed',
            borderWidth: 1,
          },
        ],
      }
    : null

  return (
    <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Volatility and market trend visualization</p>
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            {rangeData ? (
              <MarketChart type="bar" data={rangeData} title={`52-Week Range — ${symbol}`} />
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            {betaData ? (
              <MarketChart type="bar" data={betaData} title={`Beta — ${symbol}`} />
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 lg:col-span-2 lg:max-w-md">
            <MarketChart type="doughnut" data={SECTOR_DATA} title="Sector Allocation" />
          </div>
        </div>
      )}
    </div>
  )
}
