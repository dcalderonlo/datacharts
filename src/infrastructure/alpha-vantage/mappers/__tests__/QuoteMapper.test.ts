import { describe, it, expect } from 'vitest'
import { mapQuote } from '../QuoteMapper'

const rawFixture = {
  'Global Quote': {
    '01. symbol': 'AAPL',
    '02. open': '150.0000',
    '03. high': '155.0000',
    '04. low': '149.0000',
    '05. price': '152.0000',
    '06. volume': '1000000',
    '07. latest trading day': '2024-01-15',
    '08. previous close': '148.0000',
    '09. change': '4.0000',
    '10. change percent': '2.7000%',
  },
}

describe('mapQuote', () => {
  it('maps all fields correctly from raw Alpha Vantage response', () => {
    const result = mapQuote(rawFixture)
    expect(result.symbol).toBe('AAPL')
    expect(result.open).toBe(150)
    expect(result.high).toBe(155)
    expect(result.low).toBe(149)
    expect(result.price).toBe(152)
    expect(result.volume).toBe(1000000)
    expect(result.latestTradingDay).toBe('2024-01-15')
    expect(result.previousClose).toBe(148)
    expect(result.change).toBe(4)
  })

  it('strips the "%" sign from changePercent', () => {
    const result = mapQuote(rawFixture)
    expect(result.changePercent).toBe(2.7)
  })
})
