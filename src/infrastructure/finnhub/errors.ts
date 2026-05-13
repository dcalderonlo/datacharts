export type FinnhubErrorCode = 'RATE_LIMIT' | 'NOT_FOUND' | 'UPSTREAM_ERROR'

export class FinnhubError extends Error {
  constructor(
    public readonly code: FinnhubErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'FinnhubError'
  }
}
