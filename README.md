# dataCharts

A production-grade financial dashboard built to demonstrate real-world engineering decisions: clean architecture, type safety, authentication, CI/CD, and observability.

**Live demo:** https://datacharts.vercel.app

---

## What it does

- Real-time stock quotes, market indices, and volatility data via **Finnhub**
- Watchlist, price alerts with email/push notifications, and exportable reports
- Full authentication flow (register, login, session management)
- Automated alert checks via a cron job

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 6 (`strict`, `exactOptionalPropertyTypes`) |
| Styling | Tailwind CSS 4 + Framer Motion |
| State | Zustand 5 (SSR-safe factory pattern) |
| Auth | Auth.js v5 beta — Credentials provider, JWE sessions, Edge-safe middleware |
| Database | PostgreSQL + Prisma 7 (local Docker / Prisma Postgres on Vercel) |
| Testing | Vitest + React Testing Library + Playwright (E2E) + MSW |
| CI/CD | GitHub Actions → Docker (GHCR) → Vercel |

---

## Architecture

The project follows **Hexagonal Architecture** (ports & adapters):

```
src/
├── core/
│   ├── domain/          # Entities, ports (interfaces), domain errors
│   └── use-cases/       # Business logic — no framework dependencies
├── infrastructure/
│   ├── finnhub/         # Finnhub adapter (client, mappers, errors)
│   ├── alpha-vantage/   # Alpha Vantage adapter (kept for reference)
│   ├── repositories/    # Provider switch — one line to swap adapters
│   └── db/              # Prisma client
├── ui/                  # Atomic Design: atoms → molecules → organisms → templates
│   └── atoms | molecules | organisms | templates
├── store/               # Zustand slices (market, watchlist, notifications)
└── app/                 # Next.js App Router (pages + API routes)
```

### Key decisions

**Provider-neutral error model**

Each infrastructure adapter translates its own errors into a domain-level `MarketError`. API routes only know about `MarketError` — switching providers requires zero changes to the HTTP layer.

```
FinnhubClient      →  throws FinnhubError
FinnhubMarketAdapter  →  catches, rethrows as MarketError
handleApiError     →  handles MarketError only
```

**Adapter swap in one line**

```ts
// src/infrastructure/repositories/MarketRepository.ts
export function createMarketRepository(): IMarketRepository {
  return new FinnhubMarketAdapter() // swap to AlphaVantageMarketAdapter() to revert
}
```

**Edge-safe authentication**

Auth.js v5 with JWE-encrypted sessions. The middleware decrypts sessions using native Web Crypto API (HKDF) instead of Node.js crypto — required for Vercel Edge Runtime.

**SSR-safe Zustand**

State stores use a factory pattern to prevent hydration mismatches. Each server request gets a fresh store instance; the client reuses the singleton.

**`exactOptionalPropertyTypes: true`**

TypeScript is configured at maximum strictness. Optional fields must be omitted entirely — assigning `undefined` is a type error. This surfaces real data-shape mismatches at compile time.

---

## Testing strategy

| Type | Tool | Coverage |
|---|---|---|
| Unit | Vitest + RTL | Domain, use-cases, mappers, UI components |
| Integration | Vitest + MSW | API routes with mocked HTTP |
| E2E | Playwright | Auth flow, dashboard navigation |

```bash
npm run test          # unit + integration
npm run test:e2e      # Playwright
```

---

## CI/CD pipeline

Every PR runs: **type check → lint → test → build → E2E → CodeQL security scan**

Merges to `main` additionally: **Docker build → push to GHCR → Trivy image scan → deploy to Vercel**

---

## Local setup

**Prerequisites:** Node.js 20+, Docker

```bash
# 1. Clone and install
git clone https://github.com/dcalderonlo/datacharts.git
cd datacharts
npm install

# 2. Environment variables
cp .env.local.example .env.local
# Fill in: DATABASE_URL, AUTH_SECRET, FINNHUB_API_KEY

# 3. Start database and run migrations
docker compose up db -d
npx prisma migrate dev

# 4. Run
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for session encryption |
| `AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `FINNHUB_API_KEY` | [Finnhub](https://finnhub.io) API key (free tier works) |
| `CRON_SECRET` | Secret header for the price alert cron endpoint |
