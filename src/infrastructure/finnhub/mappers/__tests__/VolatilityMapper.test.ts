import { describe, it, expect } from 'vitest'
import { mapVolatility } from '../VolatilityMapper'

const rawFixture = {
  symbol: 'AAPL',
  metric: {
    beta: 1.2,
    '52WeekHigh': 198.5,
    '52WeekLow': 124.17,
  },
}

describe('mapVolatility', () => {
  it('maps symbol', () => {
    const result = mapVolatility(rawFixture)
    expect(result.symbol).toBe('AAPL')
  })

  it('maps beta', () => {
    const result = mapVolatility(rawFixture)
    expect(result.beta).toBe(1.2)
  })

  it('maps fiftyTwoWeekHigh and fiftyTwoWeekLow', () => {
    const result = mapVolatility(rawFixture)
    expect(result.fiftyTwoWeekHigh).toBe(198.5)
    expect(result.fiftyTwoWeekLow).toBe(124.17)
  })

  it('returns NaN for missing metric fields', () => {
    const result = mapVolatility({ symbol: 'X', metric: {} })
    expect(result.beta).toBeNaN()
    expect(result.fiftyTwoWeekHigh).toBeNaN()
    expect(result.fiftyTwoWeekLow).toBeNaN()
  })
})
