import type { IMarketRepository } from '@/core/domain/ports/IMarketRepository'
import { FinnhubMarketAdapter } from '../finnhub/adapters/FinnhubMarketAdapter'

/**
 * Factory function — returns a new adapter instance per call.
 * No module-level singleton to avoid stale state across server requests.
 */
export function createMarketRepository(): IMarketRepository {
  return new FinnhubMarketAdapter()
}
