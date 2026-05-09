import { AlphaVantageError } from './errors'

const BASE_URL = 'https://www.alphavantage.co/query'

type RawResponse = Record<string, unknown>

function getApiKey(): string {
  const key = process.env['ALPHA_VANTAGE_API_KEY']
  if (!key) {
    throw new AlphaVantageError('UPSTREAM_ERROR', 'ALPHA_VANTAGE_API_KEY is not set')
  }
  return key
}

async function fetchFromAlphaVantage(params: Record<string, string>): Promise<RawResponse> {
  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', getApiKey())
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new AlphaVantageError('UPSTREAM_ERROR', `HTTP ${response.status}: ${response.statusText}`)
  }

  const data = (await response.json()) as RawResponse

  // Alpha Vantage signals rate limit via a "Note" or "Information" key
  if ('Note' in data || 'Information' in data) {
    throw new AlphaVantageError(
      'RATE_LIMIT',
      (data['Note'] as string | undefined) ?? (data['Information'] as string) ?? 'Rate limit exceeded',
    )
  }

  return data
}

export async function fetchQuote(symbol: string): Promise<RawResponse> {
  const data = await fetchFromAlphaVantage({ function: 'GLOBAL_QUOTE', symbol })
  const quote = data['Global Quote'] as RawResponse | undefined
  if (!quote || Object.keys(quote).length === 0) {
    throw new AlphaVantageError('NOT_FOUND', `No quote found for symbol: ${symbol}`)
  }
  return data
}

export async function fetchIndices(): Promise<RawResponse[]> {
  // Alpha Vantage free tier doesn't provide a bulk indices endpoint.
  // We approximate global indices using GLOBAL_QUOTE for well-known ETF proxies.
  const indexSymbols = ['SPY', 'QQQ', 'DIA', 'IWM']
  const results = await Promise.all(
    indexSymbols.map((symbol) => fetchFromAlphaVantage({ function: 'GLOBAL_QUOTE', symbol })),
  )
  return results
}

export async function fetchCompanyProfile(symbol: string): Promise<RawResponse> {
  const data = await fetchFromAlphaVantage({ function: 'OVERVIEW', symbol })
  if (!data['Symbol']) {
    throw new AlphaVantageError('NOT_FOUND', `No company profile found for symbol: ${symbol}`)
  }
  return data
}

export async function fetchVolatility(symbol: string): Promise<RawResponse> {
  // Volatility data (Beta, 52-week high/low) is in the OVERVIEW endpoint
  const data = await fetchFromAlphaVantage({ function: 'OVERVIEW', symbol })
  if (!data['Symbol']) {
    throw new AlphaVantageError('NOT_FOUND', `No data found for symbol: ${symbol}`)
  }
  return data
}
