export type MarketErrorCode = 'RATE_LIMIT' | 'NOT_FOUND' | 'UPSTREAM_ERROR'

export class MarketError extends Error {
  constructor(
    public readonly code: MarketErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'MarketError'
  }
}
