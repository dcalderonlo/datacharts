import { describe, it, expect } from 'vitest'
import { mapIndex } from '../IndexMapper'

const rawFixture = {
  c: 475.0,
  d: 2.5,
  dp: 0.53,
}

describe('mapIndex', () => {
  it('maps price, change, and changePercent', () => {
    const result = mapIndex(rawFixture, 'SPY')
    expect(result.value).toBe(475)
    expect(result.change).toBe(2.5)
    expect(result.changePercent).toBe(0.53)
  })

  it('resolves well-known symbols to human-readable names', () => {
    expect(mapIndex(rawFixture, 'SPY').name).toBe('S&P 500')
    expect(mapIndex(rawFixture, 'QQQ').name).toBe('NASDAQ 100')
    expect(mapIndex(rawFixture, 'DIA').name).toBe('Dow Jones')
    expect(mapIndex(rawFixture, 'IWM').name).toBe('Russell 2000')
  })

  it('falls back to symbol as name for unknown symbols', () => {
    const result = mapIndex(rawFixture, 'UNKNOWN')
    expect(result.name).toBe('UNKNOWN')
    expect(result.region).toBe('Unknown')
  })

  it('sets region to United States for known symbols', () => {
    const result = mapIndex(rawFixture, 'SPY')
    expect(result.region).toBe('United States')
  })
})
