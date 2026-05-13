# Proposal: Migrate market data provider from Alpha Vantage to Finnhub

## Intent
Switch market data provider to Finnhub to overcome Alpha Vantage's restrictive rate limits (25 req/day vs 60 req/min) while maintaining the existing domain interfaces.

## Scope

### In Scope
- Swap API integration from Alpha Vantage to Finnhub for quotes, indices, profiles, and volatility.
- Create new Finnhub infrastructure folder (`src/infrastructure/finnhub/`).
- Keep existing Alpha Vantage infrastructure folder intact (`src/infrastructure/alpha-vantage/`).
- Adapt `MarketRepository` to use the new Finnhub client, maintaining ability to switch providers.
- Update environment variables to include `FINNHUB_API_KEY`.

### Out of Scope
- Caching implementation (deferred for future optimization).
- API key rotation logic.
- Changes to the core `IMarketRepository` domain port.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `market-data`: Modifies `volume` in Quote entity and `description` in CompanyProfile entity to be optional (`?`), as they are not provided by Finnhub.

## Approach
Implement the Finnhub adapter alongside the existing Alpha Vantage adapter, adhering to Hexagonal Architecture. The domain port remains unchanged.
1. Build Finnhub client and mappers for `/quote`, `/stock/profile2`, and `/stock/metric`.
2. Swap the provider in `MarketRepository.ts` to `FinnhubMarketAdapter`, while retaining `AlphaVantageMarketAdapter`.
3. Update `Quote.ts` (`volume?: number`) and `CompanyProfile.ts` (`description?: string`) to make missing data fields optional rather than deleting them.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/infrastructure/finnhub/` | New | Finnhub client, adapter, mappers, and errors |
| `src/infrastructure/MarketRepository.ts` | Modified | Swapped default provider to Finnhub |
| `src/domain/entities/Quote.ts` | Modified | `volume` field made optional |
| `src/domain/entities/CompanyProfile.ts` | Modified | `description` field made optional |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Data Gaps in UI | High | Conduct full UI audit to gracefully handle optional `volume` and `description` fields. |

## Rollback Plan
Switch the default adapter in `MarketRepository.ts` back to `AlphaVantageMarketAdapter` and revert the API key environment variables. Domain fields can remain optional.

## Dependencies
- Finnhub API Key registered and configured in the environment.

## Success Criteria
- [ ] Application fetches data successfully using Finnhub without rate limit errors in typical usage.
- [ ] Both Finnhub and Alpha Vantage adapters cleanly coexist in the infrastructure layer.
- [ ] UI correctly displays without errors when optional fields are missing.