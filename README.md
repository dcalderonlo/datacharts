# dataCharts — Enterprise Dashboard

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use the Docker Compose setup)

## Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd dataCharts

# 2. Copy and fill environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# 3. Start services
docker compose up db -d
```

## Database Migration

```bash
npx prisma migrate dev
```

## Environment Variables

### `.env.local` (local development)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret string |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key for market data |

## CI/CD

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

1. **quality** — type check, lint, build
2. **docker** — build & push image to GitHub Container Registry (main branch only)
3. **deploy** — deploy to Vercel (main branch only)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

### Vercel Environment Variables

Set these in your Vercel project dashboard:

| Variable | Description |
|---|---|
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key |
| `DATABASE_URL` | Neon (or other) PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Strong random secret |
| `NEXTAUTH_URL` | Production URL (e.g. `https://yourdomain.vercel.app`) |

## Docker

```bash
# Build image locally
docker build -t datacharts .

# Run with Docker Compose (includes Postgres)
docker compose up --build
```
