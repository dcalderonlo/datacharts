import type { CompanyProfile } from '@/core/domain/entities/CompanyProfile'

// Finnhub /stock/profile2 response shape
type RawFinnhubProfile = {
  ticker: string
  name: string
  finnhubIndustry?: string
  marketCapitalization?: number
  shareOutstanding?: number
}

export function mapCompany(raw: unknown): CompanyProfile {
  const r = raw as RawFinnhubProfile
  return {
    symbol: r.ticker,
    name: r.name,
    sector: r.finnhubIndustry ?? 'Unknown',
    industry: r.finnhubIndustry ?? 'Unknown',
    marketCap: (r.marketCapitalization ?? 0) * 1_000_000,
    peRatio: NaN,
    dividendYield: NaN,
  }
}
