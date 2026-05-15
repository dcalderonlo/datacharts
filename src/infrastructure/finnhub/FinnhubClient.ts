import { FinnhubError } from './errors'

const BASE_URL = 'https://finnhub.io/api/v1'

type RawResponse = Record<string, unknown>

class EnvironmentConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentConfigurationError'
  }
}

function getApiKey(): string {
  const key = process.env['FINNHUB_API_KEY']
  if (!key) {
    throw new EnvironmentConfigurationError('Missing environment variable: FINNHUB_API_KEY')
  }
  return key
}

async function fetchFromFinnhub(path: string, params: Record<string, string>): Promise<RawResponse> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('token', getApiKey())
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())

  if (response.status === 429) {
    throw new FinnhubError('RATE_LIMIT', 'Finnhub rate limit exceeded')
  }

  if (response.status >= 500) {
    throw new FinnhubError('UPSTREAM_ERROR', `HTTP ${response.status}: ${response.statusText}`)
  }

  if (!response.ok) {
    throw new FinnhubError('UPSTREAM_ERROR', `HTTP ${response.status}: ${response.statusText}`)
  }

  const data = (await response.json()) as RawResponse

  return data
}

export async function fetchQuote(symbol: string): Promise<RawResponse> {
  const data = await fetchFromFinnhub('/quote', { symbol })
  // Finnhub returns { c: 0, ... } even for invalid symbols — treat zero price as not found
  if (!data['c'] && data['c'] !== 0) {
    throw new FinnhubError('NOT_FOUND', `No quote found for symbol: ${symbol}`)
  }
  // Empty payload: all zeros with t === 0 means no data
  if (data['t'] === 0) {
    throw new FinnhubError('NOT_FOUND', `No quote data available for symbol: ${symbol}`)
  }
  return data
}

export async function fetchIndices(): Promise<RawResponse[]> {
  const indexSymbols = ['SPY', 'QQQ', 'DIA', 'IWM']
  const results = await Promise.all(
    indexSymbols.map((symbol) => fetchFromFinnhub('/quote', { symbol })),
  )
  return results
}

export async function fetchCompanyProfile(symbol: string): Promise<RawResponse> {
  const data = await fetchFromFinnhub('/stock/profile2', { symbol })
  if (!data['ticker']) {
    throw new FinnhubError('NOT_FOUND', `No company profile found for symbol: ${symbol}`)
  }
  return data
}

export async function fetchVolatility(symbol: string): Promise<RawResponse> {
  const data = await fetchFromFinnhub('/stock/metric', { symbol, metric: 'all' })
  if (!data['metric']) {
    throw new FinnhubError('NOT_FOUND', `No metric data found for symbol: ${symbol}`)
  }
  return data
}

export type RawFinnhubSymbolSearchItem = {
  symbol?: string
  description?: string
  type?: string
}

export type RawFinnhubSymbolSearchResponse = {
  count?: number
  result?: RawFinnhubSymbolSearchItem[]
}

export async function fetchSymbolSearch(query: string): Promise<RawFinnhubSymbolSearchResponse> {
  const data = await fetchFromFinnhub('/search', { q: query })

  if (!Array.isArray(data['result'])) {
    throw new FinnhubError('UPSTREAM_ERROR', 'Unexpected response shape from Finnhub /search')
  }

  return data as unknown as RawFinnhubSymbolSearchResponse
}
