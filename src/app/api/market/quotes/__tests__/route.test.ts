import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock next/cache before importing the route
vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
}))

vi.mock('@/infrastructure/repositories/MarketRepository', () => ({
  createMarketRepository: vi.fn(() => ({})),
}))

vi.mock('@/core/use-cases/GetRealTimeQuote', () => ({
  GetRealTimeQuote: vi.fn().mockImplementation(function () {
    return {
      execute: vi.fn().mockResolvedValue({
        symbol: 'AAPL',
        price: 152.0,
        change: 4.0,
        changePercent: 2.7,
      }),
    }
  }),
}))

vi.mock('@/infrastructure/mock/isMockMode', () => ({ isMockMode: vi.fn(() => false) }))

const makeRequest = (url: string) => new NextRequest(url)

describe('GET /api/market/quotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when symbol is missing', async () => {
    const { GET } = await import('../route')
    const req = makeRequest('http://localhost/api/market/quotes')
    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('BAD_REQUEST')
  })

  it('returns quote data for valid symbol', async () => {
    const { GET } = await import('../route')
    const req = makeRequest('http://localhost/api/market/quotes?symbol=AAPL')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.symbol).toBe('AAPL')
    expect(body.data.price).toBe(152.0)
  })

  it('returns mock data when mock mode is enabled', async () => {
    const { isMockMode } = await import('@/infrastructure/mock/isMockMode')
    vi.mocked(isMockMode).mockReturnValue(true)

    const { GET } = await import('../route')
    const req = makeRequest('http://localhost/api/market/quotes?symbol=AAPL')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toBeDefined()
  })
})
