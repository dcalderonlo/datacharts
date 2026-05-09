'use client'
import { motion } from 'framer-motion'
import { Spinner } from '@/ui/atoms/Spinner'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
)

const darkScaleOptions = {
  x: {
    ticks: { color: '#6b7280' },
    grid: { color: '#1f2937' },
  },
  y: {
    ticks: { color: '#6b7280' },
    grid: { color: '#1f2937' },
  },
}

const tooltipPlugin = {
  backgroundColor: '#111827',
  borderColor: '#374151',
  borderWidth: 1,
  titleColor: '#e5e7eb',
  bodyColor: '#9ca3af',
}

const DARK_OPTIONS: ChartOptions<'line'> | ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9ca3af' } },
    tooltip: tooltipPlugin,
  },
  scales: darkScaleOptions,
} as ChartOptions<'line'>

const DOUGHNUT_OPTIONS: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9ca3af' } },
    tooltip: tooltipPlugin,
  },
}

interface MarketChartProps {
  type: 'line' | 'bar' | 'doughnut'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: ChartData<any>
  title?: string
  isLoading?: boolean
}

export function MarketChart({ type, data, title, isLoading = false }: MarketChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="text-gray-300 font-medium text-sm">{title}</h3>}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-64 w-full"
        >
          {type === 'line' && <Line data={data} options={DARK_OPTIONS as ChartOptions<'line'>} />}
          {type === 'bar' && <Bar data={data} options={DARK_OPTIONS as ChartOptions<'bar'>} />}
          {type === 'doughnut' && <Doughnut data={data} options={DOUGHNUT_OPTIONS} />}
        </motion.div>
      )}
    </div>
  )
}
