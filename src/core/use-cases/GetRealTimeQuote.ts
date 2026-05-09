import type { IMarketRepository } from '../domain/ports/IMarketRepository'
import type { Quote } from '../domain/entities/Quote'

export class GetRealTimeQuote {
  constructor(private readonly repository: IMarketRepository) {}

  async execute(symbol: string): Promise<Quote> {
    return this.repository.getQuote(symbol)
  }
}
