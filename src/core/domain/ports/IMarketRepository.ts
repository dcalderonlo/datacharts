import type { Quote } from '../entities/Quote'
import type { MarketIndex } from '../entities/MarketIndex'
import type { CompanyProfile } from '../entities/CompanyProfile'
import type { VolatilityData } from '../entities/VolatilityData'

export interface IMarketRepository {
  getQuote(symbol: string): Promise<Quote>
  getIndices(): Promise<MarketIndex[]>
  getCompanyProfile(symbol: string): Promise<CompanyProfile>
  getVolatility(symbol: string): Promise<VolatilityData>
}
