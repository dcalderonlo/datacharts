import { StatNumber } from '@/ui/atoms/StatNumber'

interface ChartTooltipProps {
  label: string
  value: number
  color?: string
}

export function ChartTooltip({ label, value, color = '#3b82f6' }: ChartTooltipProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-400">{label}</span>
      </div>
      <StatNumber value={value} format="currency" className="text-gray-100 text-base" />
    </div>
  )
}
