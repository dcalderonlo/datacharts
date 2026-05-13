# Design: Finnhub Migration

## Technical Approach

Add `src/infrastructure/finnhub/` as a second provider implementation that mirrors the current Alpha Vantage layout. Keep `IMarketRepository` unchanged, switch only `createMarketRepository()` to `FinnhubMarketAdapter`, and make missing Finnhub fields optional in domain entities instead of deleting them.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Provider shape | Mirror `alpha-vantage/` folder structure in `finnhub/` | In-place rewrite, shared multi-provider files | Lowest cognitive load; existing adapter/client/mapper split already fits Hexagonal Architecture |
| Default wiring | Change one import/constructor in `src/infrastructure/repositories/MarketRepository.ts` | Conditional provider selection now | Approved scope is a provider swap, not runtime strategy selection |
| Missing fields | `Quote.volume?` and `CompanyProfile.description?` | Fake defaults, remove fields | Preserves domain compatibility while representing real upstream gaps honestly |
| Error contract | `FinnhubError` with `RATE_LIMIT | NOT_FOUND | UPSTREAM_ERROR` | Reuse AlphaVantageError directly | Keeps provider-local errors while preserving API route handling semantics |

## Data Flow

```text
Route Handler / Use Case
  -> createMarketRepository()
  -> FinnhubMarketAdapter
  -> FinnhubClient
  -> Finnhub HTTP endpoint
  -> mapper
  -> domain entity
```

Quote/index flow uses `/quote`; company flow uses `/stock/profile2` plus `/stock/metric`; volatility uses `/stock/metric`.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/infrastructure/finnhub/FinnhubClient.ts` | Create | Base fetch, token injection, HTTP/status validation, JSON parsing |
| `src/infrastructure/finnhub/errors.ts` | Create | `FinnhubError` type and codes |
| `src/infrastructure/finnhub/adapters/FinnhubMarketAdapter.ts` | Create | Implements `IMarketRepository` using client + mappers |
| `src/infrastructure/finnhub/mappers/QuoteMapper.ts` | Create | `/quote` -> `Quote` |
| `src/infrastructure/finnhub/mappers/IndexMapper.ts` | Create | ETF quotes -> `MarketIndex` |
| `src/infrastructure/finnhub/mappers/CompanyMapper.ts` | Create | profile + metric -> `CompanyProfile` |
| `src/infrastructure/finnhub/mappers/VolatilityMapper.ts` | Create | metric payload -> `VolatilityData` |
| `src/core/domain/entities/Quote.ts` | Modify | `volume` becomes optional |
| `src/core/domain/entities/CompanyProfile.ts` | Modify | `description` becomes optional |
| `src/infrastructure/repositories/MarketRepository.ts` | Modify | One-line adapter swap |
| `.env.local.example` | Verify/keep | Both `ALPHA_VANTAGE_API_KEY` and `FINNHUB_API_KEY` stay defined |

## Interfaces / Contracts

```ts
// src/core/domain/entities/Quote.ts
- volume: number
+ volume?: number

// src/core/domain/entities/CompanyProfile.ts
- description: string
+ description?: string
```

```ts
type FinnhubQuote = { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number; t: number }
type FinnhubProfile = { ticker: string; name: string; exchange: string; currency: string; marketCapitalization: number; finnhubIndustry?: string; logo?: string; weburl?: string }
type FinnhubMetric = { metric?: { beta?: number; '52WeekHigh'?: number; '52WeekLow'?: number; peAnnual?: number; currentDividendYieldTTM?: number } }
```

Mapping rules:
- `Quote.price <- c`, `change <- d`, `changePercent <- dp`, `high <- h`, `low <- l`, `open <- o`, `previousClose <- pc`
- `Quote.latestTradingDay <- t ? new Date(t * 1000).toISOString().split('T')[0] : ''`
- `Quote.volume <- undefined` (Finnhub `/quote` has no volume)
- `CompanyProfile.symbol <- ticker`, `sector/industry <- finnhubIndustry ?? 'Unknown'`
- `CompanyProfile.marketCap <- marketCapitalization * 1_000_000`
- `CompanyProfile.description <- undefined`
- `CompanyProfile.peRatio/dividendYield <- /stock/metric`

`FinnhubClient` should validate `FINNHUB_API_KEY` on first use, append `token`, throw `RATE_LIMIT` on HTTP 429, `UPSTREAM_ERROR` on other non-2xx, and `NOT_FOUND` when payload is empty/invalid for the requested symbol.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | New mappers, timestamp conversion, marketCap scaling, empty payload handling | Vitest fixtures mirroring Finnhub payloads |
| Unit | `FinnhubClient` error translation | Mock `fetch` for 429, 404/empty, 500 |
| Integration | `FinnhubMarketAdapter` contract with `IMarketRepository` | Mock client responses and assert mapped domain entities |
| Regression | Existing quote/report consumers with optional `volume`/`description` | Update tests and audit UI rendering paths |

## Migration / Rollout

No data migration required. Rollout is a safe infrastructure swap: add `FINNHUB_API_KEY`, deploy new adapter, keep Alpha Vantage code and key for rollback, and revert the single factory line if needed.

## Open Questions

- [ ] UI components currently render `quote.volume` directly (`QuotePanel`, `reports/page.tsx`); apply phase must decide whether to hide, format fallback text, or show placeholder when undefined.
