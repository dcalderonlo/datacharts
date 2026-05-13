import { describe, it, expect } from 'vitest'
import { mapCompany } from '../CompanyMapper'

const rawFixture = {
  ticker: 'AAPL',
  name: 'Apple Inc',
  finnhubIndustry: 'Technology',
  marketCapitalization: 3000000, // in thousands — multiply by 1_000_000 → 3e12
}

describe('mapCompany', () => {
  it('maps ticker to symbol', () => {
    const result = mapCompany(rawFixture)
    expect(result.symbol).toBe('AAPL')
  })

  it('maps name', () => {
    const result = mapCompany(rawFixture)
    expect(result.name).toBe('Apple Inc')
  })

  it('sets description to undefined', () => {
    const result = mapCompany(rawFixture)
    expect(result.description).toBeUndefined()
  })

  it('maps sector from finnhubIndustry', () => {
    const result = mapCompany(rawFixture)
    expect(result.sector).toBe('Technology')
  })

  it('uses "Unknown" sector when finnhubIndustry is absent', () => {
    const result = mapCompany({ ticker: 'X', name: 'X Corp' })
    expect(result.sector).toBe('Unknown')
  })

  it('converts marketCapitalization * 1_000_000', () => {
    const result = mapCompany(rawFixture)
    expect(result.marketCap).toBe(3000000 * 1_000_000)
  })
})
