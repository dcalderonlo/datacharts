import type { Quote } from '@/core/domain/entities/Quote'

// Finnhub /quote response shape
type RawFinnhubQuote = {
  c: number   // current price
  d: number   // change
  dp: number  // change percent
  h: number   // high
  l: number   // low
  o: number   // open
  pc: number  // previous close
  t: number   // Unix timestamp of latest trading day
}

export function mapQuote(raw: unknown): Quote {
  const q = raw as RawFinnhubQuote
  const date = new Date(q.t * 1000)
  const latestTradingDay = date.toISOString().split('T')[0]!
  return {
    symbol: '', // symbol not returned by /quote — caller must inject if needed
    open: q.o,
    high: q.h,
    low: q.l,
    price: q.c,
    latestTradingDay,
    previousClose: q.pc,
    change: q.d,
    changePercent: q.dp,
  }
}

export function mapQuoteWithSymbol(raw: unknown, symbol: string): Quote {
  return { ...mapQuote(raw), symbol }
}
