import type { VolatilityData } from '@/core/domain/entities/VolatilityData'

// Finnhub /stock/metric response shape (metric: 'all')
type RawFinnhubMetric = {
  metric: {
    beta?: number
    '52WeekHigh'?: number
    '52WeekLow'?: number
  }
  symbol: string
}

export function mapVolatility(raw: unknown): VolatilityData {
  const r = raw as RawFinnhubMetric
  const m = r.metric ?? {}
  return {
    symbol: r.symbol,
    beta: m.beta ?? NaN,
    fiftyTwoWeekHigh: m['52WeekHigh'] ?? NaN,
    fiftyTwoWeekLow: m['52WeekLow'] ?? NaN,
  }
}
