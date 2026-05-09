export type AlphaVantageErrorCode = 'RATE_LIMIT' | 'NOT_FOUND' | 'UPSTREAM_ERROR'

export class AlphaVantageError extends Error {
  constructor(
    public readonly code: AlphaVantageErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'AlphaVantageError'
  }
}
