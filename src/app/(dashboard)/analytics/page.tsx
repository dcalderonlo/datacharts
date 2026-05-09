'use client'
import dynamic from 'next/dynamic'
import type { ChartData } from 'chart.js'

const MarketChart = dynamic(
  () => import('@/ui/organisms/MarketChart').then((m) => ({ default: m.MarketChart })),
  { ssr: false }
)

// TODO: Replace with real time series endpoint data when available
const MOCK_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const lineData: ChartData<'line'> = {
  labels: MOCK_LABELS,
  datasets: [
    {
      label: 'Price Trend (AAPL)',
      data: [182, 185, 179, 192, 201, 195, 210, 208, 215, 220, 218, 225],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const barData: ChartData<'bar'> = {
  labels: MOCK_LABELS,
  datasets: [
    {
      label: 'Volume (M)',
      data: [55, 63, 48, 72, 68, 59, 81, 76, 84, 90, 78, 95],
      backgroundColor: 'rgba(139,92,246,0.7)',
      borderColor: '#7c3aed',
      borderWidth: 1,
    },
  ],
}

const doughnutData: ChartData<'doughnut'> = {
  labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'],
  datasets: [
    {
      data: [32, 18, 22, 14, 14],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    },
  ],
}

export default function AnalyticsPage() {
  return (
    <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Charts and market trend visualization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <MarketChart
            type="line"
            data={lineData}
            title="Price Trend"
          />
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <MarketChart
            type="bar"
            data={barData}
            title="Volume (M shares)"
          />
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 lg:col-span-2 lg:max-w-md">
          <MarketChart
            type="doughnut"
            data={doughnutData}
            title="Sector Allocation"
          />
        </div>
      </div>
    </div>
  )
}
