import type { MarketIndex } from '@/core/domain/entities/MarketIndex'

// Alpha Vantage GLOBAL_QUOTE used for ETF proxies of major indices
const INDEX_NAME_MAP: Record<string, { name: string; region: string }> = {
  SPY: { name: 'S&P 500', region: 'United States' },
  QQQ: { name: 'NASDAQ 100', region: 'United States' },
  DIA: { name: 'Dow Jones', region: 'United States' },
  IWM: { name: 'Russell 2000', region: 'United States' },
}

type RawGlobalQuote = {
  '01. symbol': string
  '05. price': string
  '09. change': string
  '10. change percent': string
}

type RawQuoteResponse = {
  'Global Quote': RawGlobalQuote
}

export function mapIndex(raw: unknown): MarketIndex {
  const response = raw as RawQuoteResponse
  const q = response['Global Quote']
  const symbol = q['01. symbol']
  const meta = INDEX_NAME_MAP[symbol] ?? { name: symbol, region: 'Unknown' }
  return {
    name: meta.name,
    value: parseFloat(q['05. price']),
    change: parseFloat(q['09. change']),
    changePercent: parseFloat(q['10. change percent'].replace('%', '')),
    region: meta.region,
  }
}
