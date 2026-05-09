import type { IMarketRepository } from '../domain/ports/IMarketRepository'
import type { CompanyProfile } from '../domain/entities/CompanyProfile'

export class GetCompanyProfile {
  constructor(private readonly repository: IMarketRepository) {}

  async execute(symbol: string): Promise<CompanyProfile> {
    return this.repository.getCompanyProfile(symbol)
  }
}
