/**
 * Returns true when mock data mode is enabled.
 * Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local to activate.
 * Never use real API calls in development to avoid burning rate limits.
 */
export const isMockMode = (): boolean =>
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
