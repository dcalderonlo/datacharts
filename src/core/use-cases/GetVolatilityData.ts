import type { IMarketRepository } from '../domain/ports/IMarketRepository'
import type { VolatilityData } from '../domain/entities/VolatilityData'

export class GetVolatilityData {
  constructor(private readonly repository: IMarketRepository) {}

  async execute(symbol: string): Promise<VolatilityData> {
    return this.repository.getVolatility(symbol)
  }
}
