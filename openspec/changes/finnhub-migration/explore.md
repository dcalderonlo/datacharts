# Exploration: Migrate Market Data Provider — Alpha Vantage → Finnhub

## Current State

The project uses a clean Hexagonal Architecture. The data flow is:

```
IMarketRepository (port)
  └── AlphaVantageMarketAdapter (adapter — implements the port)
        ├── AlphaVantageClient.ts  (HTTP layer, API key, error handling)
        └── mappers/               (raw response → domain entity)
              ├── QuoteMapper.ts
              ├── IndexMapper.ts
              ├── CompanyMapper.ts
              └── VolatilityMapper.ts
```

`MarketRepository.ts` is a simple factory (`createMarketRepository`) that returns `new AlphaVantageMarketAdapter()`. This is the **only coupling point** between the domain and the infrastructure provider.

### Alpha Vantage endpoints in use

| Method | AV endpoint | Params |
|---|---|---|
| `getQuote(symbol)` | `GLOBAL_QUOTE` | `symbol` |
| `getIndices()` | `GLOBAL_QUOTE` × 4 | SPY, QQQ, DIA, IWM (ETF proxies) |
| `getCompanyProfile(symbol)` | `OVERVIEW` | `symbol` |
| `getVolatility(symbol)` | `OVERVIEW` | `symbol` (reuses same call) |

### Key AV trait
Rate limiting is signalled in the **response body** via a `Note` or `Information` key, NOT an HTTP status code. This is a known AV quirk that the client already handles.

---

## Finnhub API Equivalents

Base URL: `https://finnhub.io/api/v1`  
Auth: `token` query param (or `X-Finnhub-Token` header)  
Free tier: **60 req/min**

### Endpoint mapping

| Domain need | Finnhub endpoint | Response fields |
|---|---|---|
| Quote | `GET /quote?symbol=X` | `o` (open), `h` (high), `l` (low), `c` (current/price), `pc` (prev close), `d` (change), `dp` (change%), `t` (timestamp) |
| Indices (ETFs) | `GET /quote?symbol=X` × 4 | Same as above — SPY/QQQ/DIA/IWM are valid symbols |
| Company profile | `GET /stock/profile2?symbol=X` | `ticker`, `name`, `finnhubIndustry`, `marketCapitalization`, `country`, `exchange`, `logo`, `weburl` |
| Volatility / Beta | `GET /stock/metric?symbol=X&metric=all` | `metric.beta`, `metric.52WeekHigh`, `metric.52WeekLow` |

### Finnhub response shapes

**Quote** (`/quote`):
```json
{ "c": 180.5, "d": 1.2, "dp": 0.67, "h": 181.0, "l": 179.0, "o": 179.5, "pc": 179.3, "t": 1715000000 }
```
- All fields are **numbers** (not strings like AV) — no `parseFloat` needed
- No `volume` field — this is a **data gap**
- `latestTradingDay` must be derived from `t` (Unix timestamp)

**CompanyProfile2** (`/stock/profile2`):
```json
{ "ticker": "AAPL", "name": "Apple Inc", "finnhubIndustry": "Technology", "marketCapitalization": 2800000, "country": "US", "exchange": "NASDAQ NMS - GLOBAL MARKET", "logo": "https://...", "weburl": "https://apple.com" }
```
- `marketCapitalization` is in **millions** (AV is in raw dollars) — needs ×1,000,000 in mapper
- No `description` field — **data gap**
- No `sector` field (only `finnhubIndustry`) — **partial gap** (can use `finnhubIndustry` as sector)
- No `peRatio`, no `dividendYield` — **data gaps** (these require separate `/stock/metric` call)

**BasicFinancials** (`/stock/metric?metric=all`):
```json
{ "symbol": "AAPL", "metric": { "beta": 1.2, "52WeekHigh": 199.0, "52WeekLow": 143.0, "peAnnual": 28.5, "currentDividendYieldTTM": 0.5 } }
```
- `beta`, `52WeekHigh`, `52WeekLow` → direct mapping to `VolatilityData`
- `peAnnual` and `currentDividendYieldTTM` available here → can populate `CompanyProfile.peRatio` and `dividendYield` with a second call

### Free tier constraints
- **60 req/min** (~1 req/sec sustained)
- No bulk indices endpoint — same pattern as AV (4 individual quote calls)
- `getVolatility` and `getCompanyProfile` will each need 1 call to `/stock/metric` if we want `peRatio`/`dividendYield` on the profile, or we make 2 calls for the company profile method

---

## Data Gaps Summary

| Field | Domain entity | AV source | Finnhub | Resolution |
|---|---|---|---|---|
| `volume` | `Quote` | GLOBAL_QUOTE `06. volume` | ❌ not in `/quote` | **Drop or make optional** |
| `latestTradingDay` | `Quote` | GLOBAL_QUOTE `07. latest trading day` | Derive from `t` (timestamp) | Convert Unix→date string |
| `description` | `CompanyProfile` | OVERVIEW `Description` | ❌ not in profile2 | **Drop or make optional** |
| `sector` | `CompanyProfile` | OVERVIEW `Sector` | Use `finnhubIndustry` | Rename/reuse — acceptable |
| `peRatio` | `CompanyProfile` | OVERVIEW `PERatio` | `/stock/metric` `peAnnual` | Second API call needed |
| `dividendYield` | `CompanyProfile` | OVERVIEW `DividendYield` | `/stock/metric` `currentDividendYieldTTM` | Same second call |
| `marketCap` units | `CompanyProfile` | Raw dollars | Millions (×1e6) | Multiply in mapper |

---

## Affected Files

| File | Change needed |
|---|---|
| `src/infrastructure/alpha-vantage/AlphaVantageClient.ts` | **Delete** (replace with FinnhubClient.ts) |
| `src/infrastructure/alpha-vantage/adapters/AlphaVantageMarketAdapter.ts` | **Delete** (replace with FinnhubMarketAdapter.ts) |
| `src/infrastructure/alpha-vantage/mappers/QuoteMapper.ts` | **Delete** (replace) |
| `src/infrastructure/alpha-vantage/mappers/IndexMapper.ts` | **Delete** (replace) |
| `src/infrastructure/alpha-vantage/mappers/CompanyMapper.ts` | **Delete** (replace) |
| `src/infrastructure/alpha-vantage/mappers/VolatilityMapper.ts` | **Delete** (replace) |
| `src/infrastructure/alpha-vantage/errors.ts` | **Delete** (replace with finnhub/errors.ts) |
| `src/infrastructure/repositories/MarketRepository.ts` | **Update** — swap import to FinnhubMarketAdapter |
| `src/core/domain/entities/Quote.ts` | **Maybe update** — `volume` and `latestTradingDay` may change |
| `src/core/domain/entities/CompanyProfile.ts` | **Maybe update** — `description` may need to be optional |
| `.env` / `.env.example` | Rename `ALPHA_VANTAGE_API_KEY` → `FINNHUB_API_KEY` |

**Core domain ports (`IMarketRepository.ts`) — NO change needed.** The interface is provider-agnostic.

---

## New Folder Structure

```
src/infrastructure/finnhub/
  ├── FinnhubClient.ts              (HTTP layer — handles auth, rate limit, errors)
  ├── errors.ts                     (FinnhubError with same code shape: RATE_LIMIT | NOT_FOUND | UPSTREAM_ERROR)
  ├── adapters/
  │   └── FinnhubMarketAdapter.ts   (implements IMarketRepository)
  └── mappers/
      ├── QuoteMapper.ts
      ├── IndexMapper.ts
      ├── CompanyMapper.ts
      └── VolatilityMapper.ts
```

The `alpha-vantage/` folder can be **fully deleted** after the migration.

---

## Approaches

### Approach 1 — Full replacement (recommended)
Create `src/infrastructure/finnhub/` with a clean implementation. Delete `alpha-vantage/`. Update `MarketRepository.ts` factory. Handle data gaps by making `volume` and `description` optional in domain entities.

- **Pros**: Clean cut, no dead code, consistent architecture
- **Cons**: Domain entity changes touch types used throughout the app
- **Effort**: Medium

### Approach 2 — Keep AV folder, add Finnhub alongside
Create `finnhub/` folder, update the factory, but leave `alpha-vantage/` in place as a fallback.

- **Pros**: Safer rollback
- **Cons**: Dead code, confusing dual infrastructure, against Hexagonal clarity
- **Effort**: Medium (same work, more mess)

### Approach 3 — Adapter rename in-place
Rename `alpha-vantage/` to `finnhub/` and replace internals.

- **Pros**: Minimal diff noise
- **Cons**: Git history gets muddied; cleaner to create new folder
- **Effort**: Low–Medium

---

## Recommendation

**Approach 1 — Full replacement.**

The architecture is perfectly set up for this: the port (`IMarketRepository`) is untouched, and the factory (`createMarketRepository`) is the single wiring point. The migration is a pure infrastructure swap.

For data gaps:
- `Quote.volume` → make optional (`volume?: number`). Finnhub `/quote` simply doesn't provide it.
- `CompanyProfile.description` → make optional (`description?: string`). No equivalent in Finnhub free tier.
- `CompanyProfile.peRatio` + `dividendYield` → fetch from `/stock/metric` in the same `getCompanyProfile` call (2 sequential calls, both fast).
- `Quote.latestTradingDay` → derive from the `t` timestamp field using `new Date(t * 1000).toISOString().split('T')[0]`.

Rate limit: 4 index calls + 1 quote + potentially 2 calls for company profile = up to 7 calls per user action, well within 60 req/min for a typical dashboard.

---

## Risks

1. **Domain entity changes** — making `volume` and `description` optional will propagate to any UI components or use cases that currently treat them as required. Must audit usages before making them optional.
2. **`marketCap` unit mismatch** — Finnhub returns millions. Forgetting the ×1,000,000 conversion will silently return wrong data. Must document in mapper clearly.
3. **Rate limit under load** — 60 req/min is tight if the dashboard polls frequently. A simple in-memory cache (TTL ~15s on quotes) should be considered in the design phase.
4. **Finnhub rate limit signal** — unlike AV (body-level `Note` key), Finnhub signals rate limits via **HTTP 429**. The new client must check the status code, not the body.
5. **`latestTradingDay` derivation** — the `t` field in Finnhub quote is a Unix timestamp (seconds). If `t` is 0 or null when market is closed, the derived date will be wrong. Needs a null-guard.
6. **`peRatio`/`dividendYield` double call** — `getCompanyProfile` will need 2 API calls (`/stock/profile2` + `/stock/metric`). If the second call fails, partial data must be handled gracefully.

---

## Ready for Proposal

**Yes.** The migration scope is well-bounded:
- 1 folder created, 1 folder deleted, 1 factory line changed
- 2 optional domain entity fields
- 4 new mappers, 1 new client, 1 new adapter
- Env var rename

The main decision to validate in the proposal: whether to make `volume` and `description` optional at the domain level, or drop them entirely from the entities.
