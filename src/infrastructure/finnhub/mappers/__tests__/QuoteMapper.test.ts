import { describe, it, expect } from 'vitest'
import { mapQuote, mapQuoteWithSymbol } from '../QuoteMapper'

// Unix timestamp for 2024-01-15 (UTC)
// 2024-01-15T00:00:00Z = 1705276800
const T = 1705276800

const rawFixture = {
  c: 152.0,
  d: 4.0,
  dp: 2.7,
  h: 155.0,
  l: 149.0,
  o: 150.0,
  pc: 148.0,
  t: T,
}

describe('mapQuote', () => {
  it('maps numeric fields correctly', () => {
    const result = mapQuote(rawFixture)
    expect(result.open).toBe(150)
    expect(result.high).toBe(155)
    expect(result.low).toBe(149)
    expect(result.price).toBe(152)
    expect(result.previousClose).toBe(148)
    expect(result.change).toBe(4)
    expect(result.changePercent).toBe(2.7)
  })

  it('converts Unix timestamp t to ISO date string', () => {
    const result = mapQuote(rawFixture)
    expect(result.latestTradingDay).toBe('2024-01-15')
  })

  it('sets volume to undefined', () => {
    const result = mapQuote(rawFixture)
    expect(result.volume).toBeUndefined()
  })

  it('sets symbol to empty string when using mapQuote directly', () => {
    const result = mapQuote(rawFixture)
    expect(result.symbol).toBe('')
  })
})

describe('mapQuoteWithSymbol', () => {
  it('injects the provided symbol', () => {
    const result = mapQuoteWithSymbol(rawFixture, 'AAPL')
    expect(result.symbol).toBe('AAPL')
  })
})
