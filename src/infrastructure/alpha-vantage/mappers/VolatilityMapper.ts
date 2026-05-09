import type { VolatilityData } from '@/core/domain/entities/VolatilityData'

type RawOverview = {
  Symbol: string
  Beta: string
  '52WeekHigh': string
  '52WeekLow': string
}

export function mapVolatility(raw: unknown): VolatilityData {
  const r = raw as RawOverview
  return {
    symbol: r.Symbol,
    beta: parseFloat(r.Beta),
    fiftyTwoWeekHigh: parseFloat(r['52WeekHigh']),
    fiftyTwoWeekLow: parseFloat(r['52WeekLow']),
  }
}
