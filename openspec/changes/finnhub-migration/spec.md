# Delta Spec: Finnhub Migration

## ADDED Requirements

### Requirement: Finnhub Adapter Endpoints
The system MUST implement a Finnhub adapter fetching from specific `/quote`, `/stock/profile2`, and `/stock/metric` endpoints.

#### Scenario: Fetching stock quote
- GIVEN a valid stock symbol
- WHEN the user requests a quote
- THEN the system MUST fetch from `GET /quote?symbol={symbol}`
- AND map `c, d, dp, h, l, o, pc, t` to the domain `Quote` entity

#### Scenario: Fetching index quotes
- GIVEN a request for market indices
- WHEN `getIndices()` is called
- THEN the system MUST fetch from `GET /quote` for predefined symbols: SPY, QQQ, DIA, IWM

#### Scenario: Fetching company profile
- GIVEN a valid stock symbol
- WHEN the user requests the company profile
- THEN the system MUST fetch from `GET /stock/profile2?symbol={symbol}`

#### Scenario: Fetching volatility metrics
- GIVEN a valid stock symbol
- WHEN the user requests volatility metrics
- THEN the system MUST fetch from `GET /stock/metric?symbol={symbol}&metric=all`
- AND map `beta, 52WeekHigh, 52WeekLow`

#### Scenario: Symbol not found
- GIVEN an invalid stock symbol
- WHEN data is requested via the Finnhub adapter
- THEN the system MUST throw a `SymbolNotFoundError`

### Requirement: Finnhub Rate Limiting
The system MUST handle the 60 requests/minute Finnhub free-tier limit.

#### Scenario: Rate limit exceeded (HTTP 429)
- GIVEN the Finnhub adapter has exceeded 60 requests per minute
- WHEN a new request is made
- THEN the system MUST return a `RateLimitExceededError`

### Requirement: Finnhub Configuration
The system MUST require `FINNHUB_API_KEY` for the new adapter to function, alongside the existing `ALPHA_VANTAGE_API_KEY`.

#### Scenario: Missing environment variable
- GIVEN the `FINNHUB_API_KEY` environment variable is not set
- WHEN the Finnhub adapter is instantiated
- THEN the system MUST throw an `EnvironmentConfigurationError`

## MODIFIED Requirements

### Requirement: Default Market Adapter
The system MUST use the `FinnhubMarketAdapter` as the default implementation for `MarketRepository`.
(Previously: The system uses Alpha Vantage as the default adapter)

#### Scenario: Injecting default repository
- GIVEN the application starts
- WHEN the `MarketRepository` is resolved
- THEN it MUST be an instance of `FinnhubMarketAdapter`
- AND the Alpha Vantage adapter MUST remain available for explicit usage

### Requirement: Domain Entity Optional Fields
The system MUST treat `volume` on the `Quote` entity and `description` on the `CompanyProfile` entity as optional (nullable/undefined) properties.
(Previously: Quote volume and CompanyProfile description were required fields)

#### Scenario: Missing volume and description data
- GIVEN the Finnhub API response lacks `volume` or `description`
- WHEN the adapter maps the response to domain entities
- THEN the mapping MUST succeed
- AND the resulting domain entities MUST have `volume: undefined` and `description: undefined`
