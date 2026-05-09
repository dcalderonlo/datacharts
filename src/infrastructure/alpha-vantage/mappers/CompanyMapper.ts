import type { CompanyProfile } from '@/core/domain/entities/CompanyProfile'

type RawOverview = {
  Symbol: string
  Name: string
  Description: string
  Sector: string
  Industry: string
  MarketCapitalization: string
  PERatio: string
  DividendYield: string
}

export function mapCompany(raw: unknown): CompanyProfile {
  const r = raw as RawOverview
  return {
    symbol: r.Symbol,
    name: r.Name,
    description: r.Description,
    sector: r.Sector,
    industry: r.Industry,
    marketCap: parseFloat(r.MarketCapitalization),
    peRatio: parseFloat(r.PERatio),
    dividendYield: parseFloat(r.DividendYield),
  }
}
