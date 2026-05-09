import type { IMarketRepository } from '../domain/ports/IMarketRepository'
import type { MarketIndex } from '../domain/entities/MarketIndex'

export class GetMarketIndices {
  constructor(private readonly repository: IMarketRepository) {}

  async execute(): Promise<MarketIndex[]> {
    return this.repository.getIndices()
  }
}
