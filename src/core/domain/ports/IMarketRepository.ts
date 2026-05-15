import type { Quote } from '../entities/Quote'
import type { MarketIndex } from '../entities/MarketIndex'
import type { CompanyProfile } from '../entities/CompanyProfile'
import type { VolatilityData } from '../entities/VolatilityData'
import type { SymbolSearchResult } from '../entities/SymbolSearchResult'

export interface IMarketRepository {
  getQuote(symbol: string): Promise<Quote>
  getIndices(): Promise<MarketIndex[]>
  getCompanyProfile(symbol: string): Promise<CompanyProfile>
  getVolatility(symbol: string): Promise<VolatilityData>
  searchSymbols(query: string): Promise<SymbolSearchResult[]>
}
