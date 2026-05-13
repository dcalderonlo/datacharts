import type { MarketIndex } from '@/core/domain/entities/MarketIndex'

const INDEX_NAME_MAP: Record<string, { name: string; region: string }> = {
  SPY: { name: 'S&P 500', region: 'United States' },
  QQQ: { name: 'NASDAQ 100', region: 'United States' },
  DIA: { name: 'Dow Jones', region: 'United States' },
  IWM: { name: 'Russell 2000', region: 'United States' },
}

type RawFinnhubQuote = {
  c: number   // current price
  d: number   // change
  dp: number  // change percent
}

export function mapIndex(raw: unknown, symbol: string): MarketIndex {
  const q = raw as RawFinnhubQuote
  const meta = INDEX_NAME_MAP[symbol] ?? { name: symbol, region: 'Unknown' }
  return {
    name: meta.name,
    value: q.c,
    change: q.d,
    changePercent: q.dp,
    region: meta.region,
  }
}
