import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to test the client functions — import after env manipulation
async function importClient() {
  // Re-import fresh module to pick up env changes
  return await import('../FinnhubClient')
}

describe('FinnhubClient', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('missing FINNHUB_API_KEY', () => {
    it('throws FinnhubError with UPSTREAM_ERROR when key is not set', async () => {
      delete process.env['FINNHUB_API_KEY']
      const { fetchQuote } = await importClient()
      await expect(fetchQuote('AAPL')).rejects.toMatchObject({
        name: 'FinnhubError',
        code: 'UPSTREAM_ERROR',
        message: 'FINNHUB_API_KEY is not set',
      })
    })
  })

  describe('HTTP 429 rate limit', () => {
    it('throws FinnhubError with RATE_LIMIT code', async () => {
      process.env['FINNHUB_API_KEY'] = 'test-key'
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      }))
      const { fetchQuote } = await importClient()
      await expect(fetchQuote('AAPL')).rejects.toMatchObject({
        name: 'FinnhubError',
        code: 'RATE_LIMIT',
      })
    })
  })

  describe('empty / zero-timestamp payload', () => {
    it('throws FinnhubError with NOT_FOUND when t === 0', async () => {
      process.env['FINNHUB_API_KEY'] = 'test-key'
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ c: 0, d: 0, dp: 0, h: 0, l: 0, o: 0, pc: 0, t: 0 }),
      }))
      const { fetchQuote } = await importClient()
      await expect(fetchQuote('INVALID')).rejects.toMatchObject({
        name: 'FinnhubError',
        code: 'NOT_FOUND',
      })
    })
  })

  describe('upstream 5xx errors', () => {
    it('throws FinnhubError with UPSTREAM_ERROR for 500', async () => {
      process.env['FINNHUB_API_KEY'] = 'test-key'
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }))
      const { fetchQuote } = await importClient()
      await expect(fetchQuote('AAPL')).rejects.toMatchObject({
        name: 'FinnhubError',
        code: 'UPSTREAM_ERROR',
      })
    })

    it('throws FinnhubError with UPSTREAM_ERROR for 503', async () => {
      process.env['FINNHUB_API_KEY'] = 'test-key'
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      }))
      const { fetchQuote } = await importClient()
      await expect(fetchQuote('AAPL')).rejects.toMatchObject({
        name: 'FinnhubError',
        code: 'UPSTREAM_ERROR',
      })
    })
  })

  describe('successful response', () => {
    it('returns raw data when response is valid', async () => {
      process.env['FINNHUB_API_KEY'] = 'test-key'
      const payload = { c: 150, d: 1, dp: 0.67, h: 155, l: 148, o: 149, pc: 149, t: 1705276800 }
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => payload,
      }))
      const { fetchQuote } = await importClient()
      const result = await fetchQuote('AAPL')
      expect(result).toEqual(payload)
    })
  })
})
