# Tasks: Finnhub Migration

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 420-560 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: domain + Finnhub client/mappers/tests → PR 2: adapter wiring + UI + regression |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Add domain optionals and Finnhub client/mappers with unit tests | PR 1 | Clean provider slice; no repo/UI switch yet |
| 2 | Wire adapter, patch UI/report fallbacks, add contract/regression coverage | PR 2 | Depends on PR 1; includes rollback-sensitive integration |

## Phase 1: Domain entity changes

- [ ] 1.1 Update `src/core/domain/entities/Quote.ts` to make `volume?: number` and confirm downstream types accept `undefined`.
- [ ] 1.2 Update `src/core/domain/entities/CompanyProfile.ts` to make `description?: string` without changing `IMarketRepository`.

## Phase 2: Finnhub infrastructure

- [ ] 2.1 Create `src/infrastructure/finnhub/errors.ts` with `FinnhubError` and `RATE_LIMIT | NOT_FOUND | UPSTREAM_ERROR` codes.
- [ ] 2.2 Create `src/infrastructure/finnhub/FinnhubClient.ts` for API-key validation, `token` injection, JSON parsing, and 429/empty/5xx translation.
- [ ] 2.3 Create `src/infrastructure/finnhub/mappers/QuoteMapper.ts` and `IndexMapper.ts` from `/quote`, including ISO date conversion and `volume: undefined`.
- [ ] 2.4 Create `src/infrastructure/finnhub/mappers/CompanyMapper.ts` and `VolatilityMapper.ts` from `/stock/profile2` + `/stock/metric`, including market-cap scaling and optional description.
- [ ] 2.5 Create `src/infrastructure/finnhub/adapters/FinnhubMarketAdapter.ts` mirroring the Alpha Vantage adapter and composing client + mappers.

## Phase 3: Repository wiring

- [ ] 3.1 Change `src/infrastructure/repositories/MarketRepository.ts` to instantiate `FinnhubMarketAdapter` with a one-line provider swap.

## Phase 4: UI audit and fixes

- [ ] 4.1 Update `src/ui/organisms/QuotePanel.tsx` so missing `quote.volume` renders a safe placeholder or hidden state instead of passing `undefined` blindly.
- [ ] 4.2 Update `src/app/(dashboard)/reports/page.tsx` so export rows and table cells handle optional `volume` consistently.
- [ ] 4.3 Audit any remaining `volume` / `description` consumers under `src/` and normalize fallback behavior where required.

## Phase 5: Tests

- [ ] 5.1 Add mapper unit tests under `src/infrastructure/finnhub/mappers/__tests__/` for quote, index, company, and volatility fixtures.
- [ ] 5.2 Add `FinnhubClient` tests for missing `FINNHUB_API_KEY`, HTTP 429, empty/404-style payloads, and generic upstream failures.
- [ ] 5.3 Add adapter contract tests for `FinnhubMarketAdapter` covering quote, indices, company profile, and volatility mapping through `IMarketRepository`.
- [ ] 5.4 Update regression tests or snapshots affected by optional `volume` / `description`, including report/export behavior if covered.

## Phase 6: Env var updates

- [ ] 6.1 Verify `.env.local.example` keeps `ALPHA_VANTAGE_API_KEY` and `FINNHUB_API_KEY`; only document changes if naming/order comments need alignment.
