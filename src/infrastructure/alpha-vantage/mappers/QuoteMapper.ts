import type { Quote } from '@/core/domain/entities/Quote'

type RawGlobalQuote = {
  '01. symbol': string
  '02. open': string
  '03. high': string
  '04. low': string
  '05. price': string
  '06. volume': string
  '07. latest trading day': string
  '08. previous close': string
  '09. change': string
  '10. change percent': string
}

type RawQuoteResponse = {
  'Global Quote': RawGlobalQuote
}

export function mapQuote(raw: unknown): Quote {
  const response = raw as RawQuoteResponse
  const q = response['Global Quote']
  return {
    symbol: q['01. symbol'],
    open: parseFloat(q['02. open']),
    high: parseFloat(q['03. high']),
    low: parseFloat(q['04. low']),
    price: parseFloat(q['05. price']),
    volume: parseInt(q['06. volume'], 10),
    latestTradingDay: q['07. latest trading day'],
    previousClose: parseFloat(q['08. previous close']),
    change: parseFloat(q['09. change']),
    changePercent: parseFloat(q['10. change percent'].replace('%', '')),
  }
}
