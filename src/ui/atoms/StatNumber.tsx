type Format = 'currency' | 'percent' | 'number' | 'volume'

interface StatNumberProps {
  value: number
  format?: Format
  className?: string
}

function formatValue(value: number, format: Format): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    case 'percent':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value / 100)
    case 'volume':
      if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
      if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
      return new Intl.NumberFormat('en-US').format(value)
    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
  }
}

export function StatNumber({ value, format = 'number', className = '' }: StatNumberProps) {
  return (
    <span className={`font-mono font-semibold tabular-nums ${className}`}>
      {formatValue(value, format)}
    </span>
  )
}
