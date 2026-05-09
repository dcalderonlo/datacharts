# Proposal: Enterprise Dashboard

## Intent

Build a scalable, real-time enterprise financial dashboard monitoring market data via Alpha Vantage API. Enforces Hexagonal Architecture, Atomic Design, and Zustand in Next.js.

## Scope

### In Scope
- Sections: Overview, Analytics, Reports.
- Alpha Vantage integration (Quotes, Indices, Company, Volatility).
- Server-side only API communication (Adapter + Mapper pattern).
- Authentication (v1).
- Dockerized CI/CD via GitHub Actions to Vercel.

### Out of Scope
- Users and Settings sections.
- Client-side exposure of API keys.

## Capabilities

### New Capabilities
- `market-monitoring`: Real-time quotes, indices, and volatility.
- `reporting`: Exportable summary reports.
- `user-auth`: Authentication flows for dashboard access.

### Modified Capabilities
- None

## Approach

Use Next.js App Router with Hexagonal Architecture. Domain logic remains pure in `src/core/`. External Alpha Vantage data is handled by Adapters and normalized by Mappers in `src/infrastructure/`. UI follows Atomic Design in `src/ui/`. State uses Zustand slice pattern with an SSR-safe root factory provider in `src/store/`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/(auth)/*` | New | Auth routes |
| `src/app/(dashboard)/*` | New | Dashboard layouts and pages |
| `src/app/api/market/*` | New | Route handlers for client actions |
| `src/core/` | New | Domain entities and ports |
| `src/infrastructure/` | New | API adapters and mappers |
| `src/store/` | New | Zustand domain slices |
| `src/ui/` | New | Atomic Design components |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Alpha Vantage rate limits | High | Next.js data cache |
| Zustand SSR leakage | High | Factory pattern + `useRef` provider |
| Docker deploy issues | Med | CI/CD validates build before Vercel push |

## Rollback Plan

Revert the merge commit and redeploy the previous stable build hash from CI/CD.

## Dependencies

- next, react
- zustand
- tailwindcss, framer-motion
- vitest

## Success Criteria

- [ ] Alpha Vantage data correctly mapped to domain entities.
- [ ] `ALPHA_VANTAGE_API_KEY` is completely hidden from the client.
- [ ] CI/CD pipeline builds Docker container and passes tests.
- [ ] Application deploys successfully to Vercel.
- [ ] Zustand store operates without SSR state leakage.