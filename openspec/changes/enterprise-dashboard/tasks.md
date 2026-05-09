# Tasks: Enterprise Dashboard

## Phase 0: Project Setup
- [x] 0.1 Bootstrap Next.js foundation — Files: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.js`, `tailwind.config.ts`, `.eslintrc.*`, `.prettierrc`, `src/app/{layout.tsx,globals.css}`, `.env.local.example`, `.gitignore`, `src/{core,infrastructure,ui,store}/.gitkeep`. AC: Next 14 strict + Tailwind + lint/format scaffold ready; env sample keeps secrets server-only. Deps: none.

## Phase 1: Domain Layer
- [x] 1.1 Model market domain — Files: `src/core/domain/entities/{Quote,MarketIndex,CompanyProfile,VolatilityData}.ts`, `src/core/domain/ports/IMarketRepository.ts`. AC: typed entities and repository contract cover quotes, indices, company, volatility. Deps: 0.1.
- [x] 1.2 Implement use-cases — Files: `src/core/use-cases/{GetRealTimeQuote,GetMarketIndices,GetCompanyProfile,GetVolatilityData}.ts`. AC: each use-case depends only on `IMarketRepository` and returns domain types. Deps: 1.1.

## Phase 2: Infrastructure Layer
- [x] 2.1 Build Alpha Vantage adapter chain — Files: `src/infrastructure/alpha-vantage/{AlphaVantageClient.ts,errors.ts}`, `src/infrastructure/alpha-vantage/mappers/{QuoteMapper,IndexMapper,CompanyMapper,VolatilityMapper}.ts`, `src/infrastructure/alpha-vantage/adapters/AlphaVantageMarketAdapter.ts`. AC: raw payloads map to domain entities; rate-limit/upstream errors normalize cleanly. Deps: 1.2.
- [x] 2.2 Implement repository bridge — Files: `src/infrastructure/repositories/MarketRepository.ts`. AC: repository satisfies `IMarketRepository` by delegating to the adapter only. Deps: 2.1.

## Phase 3: API Route Handlers
- [x] 3.1 Expose market endpoints — Files: `src/app/api/market/_lib/{handleRouteError,cache}.ts`, `src/app/api/market/{quotes,indices,company,volatility}/route.ts`. AC: handlers return `{data}` or `{error,code,retryAfter}` and use `unstable_cache` for Alpha Vantage calls. Deps: 2.2.

## Phase 4: Auth
- [x] 4.1 Configure auth flow — Files: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/(auth)/{layout.tsx,login/page.tsx}`, `middleware.ts`, `src/store/auth.slice.ts`. AC: unauthenticated users redirect to `/login`, valid sessions reach dashboard, auth slice mirrors session/loading state. Deps: 0.1.

## Phase 5: Zustand Store
- [x] 5.1 Compose SSR-safe store — Files: `src/store/{market.slice.ts,ui.slice.ts,index.ts}`, `src/ui/providers/StoreProvider.tsx`. AC: store uses slice pattern + factory + `useRef`; no singleton leakage in SSR. Deps: 3.1, 4.1.

## Phase 6: UI — Atoms
- [x] 6.1 Build base atoms — Files: `src/ui/atoms/{Button,Badge,Spinner,Input,Card,StatNumber,TrendArrow}.tsx`. AC: atoms are typed, reusable, and Tailwind-responsive for dashboard states. Deps: 0.1.

## Phase 7: UI — Molecules
- [x] 7.1 Build dashboard molecules — Files: `src/ui/molecules/{MetricCard,ChartTooltip,SearchBar,AlertBanner,ExportButton}.tsx`. AC: molecules compose atoms for search, filters, tooltips, and rate-limit/error messaging. Deps: 5.1, 6.1.

## Phase 8: UI — Organisms
- [x] 8.1 Build navigation/data organisms — Files: `src/ui/organisms/{NavSidebar,QuotePanel,IndexTable}.tsx`. AC: organisms render authenticated navigation plus quote/index states from store or page props. Deps: 5.1, 7.1.
- [x] 8.2 Build chart organism — Files: `src/ui/organisms/MarketChart.tsx`. AC: Chart.js loads client-only and animates dataset changes with Framer Motion. Deps: 7.1.

## Phase 9: UI — Templates & Layouts
- [x] 9.1 Wire templates/layouts — Files: `src/ui/templates/{DashboardTemplate,AuthTemplate}.tsx`, `src/app/{layout.tsx,(dashboard)/layout.tsx,(auth)/layout.tsx}`. AC: templates provide shared shell, providers, and responsive layout slots. Deps: 4.1, 5.1, 8.1.

## Phase 10: Pages
- [x] 10.1 Deliver Overview page — Files: `src/app/(dashboard)/overview/page.tsx`. AC: KPI cards, real-time quotes, and market pulse render for authenticated users. Deps: 3.1, 8.1, 9.1.
- [x] 10.2 Deliver Analytics page — Files: `src/app/(dashboard)/analytics/page.tsx`. AC: charts and volatility views support dataset/date changes without SSR Chart.js failures. Deps: 3.1, 8.2, 9.1.
- [x] 10.3 Deliver Reports page — Files: `src/app/(dashboard)/reports/page.tsx`. AC: summary reporting UI renders stable aggregates and placeholders/controls for exportable reports. Deps: 3.1, 9.1.

## Phase 11: Testing
- [ ] 11.1 Add unit coverage — Files: `src/**/__tests__/*.{test,spec}.ts`. AC: Vitest covers mappers, use-cases, and slices, including rate-limit and SSR-store cases. Deps: 5.1, 10.3.
- [ ] 11.2 Add component coverage — Files: `src/ui/**/__tests__/*.{test,spec}.tsx`. AC: RTL covers atoms/molecules states, form input, and alert rendering. Deps: 7.1.
- [ ] 11.3 Add integration/E2E coverage — Files: `tests/integration/api/market/*.test.ts`, `tests/e2e/{auth,dashboard}.spec.ts`, `playwright.config.ts`, `msw/*`. AC: route handlers honor success/error contract; login and dashboard load pass end-to-end. Deps: 10.3.

## Phase 12: Docker + CI/CD
- [ ] 12.1 Containerize app — Files: `Dockerfile`, `docker-compose.yml`, `.dockerignore`. AC: multi-stage image builds and runs app with the production env contract. Deps: 10.3.
- [ ] 12.2 Automate delivery — Files: `.github/workflows/ci.yml`, `vercel.json`. AC: CI runs typecheck, lint, Vitest, Next build, Docker build, then triggers Vercel on passing `main`. Deps: 11.3, 12.1.

## Phase 13: Database Schema & Auth expansion
- [x] 13.1 Setup Prisma Models — Files: `schema.prisma`, `.env`. AC: Update `User` and add `Watchlist`, `PriceAlert`, `PushSubscription`, `Notification` models; add VAPID/Cron secrets to `.env`. Deps: None.
- [x] 13.2 Add Registration Route & Page — Files: `src/app/api/auth/register/route.ts`, `src/app/(auth)/register/page.tsx`. AC: Support bcryptjs hashing and redirect to overview after user creation. Deps: 13.1.

## Phase 14: Public Landing & Search Rate Limiting
- [x] 14.1 Modify Root Layout — Files: `middleware.ts`, `src/app/page.tsx`. AC: Stop root redirect to `/overview`, create public landing page rendering indices/top-movers. Deps: 10.1.
- [x] 14.2 Implement Anonymous Search Limiter — Files: `middleware.ts`, `src/app/api/market/quotes/route.ts`. AC: Inject/validate `anon_search_count` httpOnly cookie. Block >3 daily searches and render CTA UI. Deps: 14.1.
- [x] 14.3 Create Ad Placeholders — Files: `src/ui/molecules/AdBanner.tsx`. AC: Add non-intrusive Ad placeholder molecules onto the public and conditionally on authenticated pages. Deps: 14.1.

## Phase 15: Watchlist Feature
- [ ] 15.1 Add Watchlist State & DB logic — Files: `src/core/domain/entities/Watchlist.ts`, `src/core/use-cases/{AddToWatchlist,RemoveFromWatchlist,GetWatchlist}.ts`, `src/store/watchlist.slice.ts`. AC: Connect Prisma watchlist calls to Zustand slice via API. Deps: 13.1.
- [ ] 15.2 Integrate Watchlist UI — Files: `src/ui/organisms/WatchlistPanel.tsx`, `src/ui/molecules/WatchlistItem.tsx`, `src/app/(dashboard)/overview/page.tsx`. AC: authenticated users can toggle symbols in QuotePanel and see list in Overview. Deps: 15.1.

## Phase 16: Push Notifications & In-App Notifications
- [ ] 16.1 Notification Store & DB logic — Files: `src/core/domain/entities/{Notification,PushSubscription}.ts`, `src/store/notification.slice.ts`, `src/app/api/notifications/route.ts`, `src/app/api/push/subscribe/route.ts`. AC: Manage in-app alerts and persist web-push subs. Deps: 13.1.
- [ ] 16.2 Implement Bell & Notification Panel — Files: `src/ui/atoms/BellIcon.tsx`, `src/ui/organisms/NotificationPanel.tsx`, `src/ui/organisms/NavSidebar.tsx`. AC: Render unread badge and dropdown list for authenticated users. Deps: 16.1.
- [ ] 16.3 Setup Service Worker for Push — Files: `public/sw.js`. AC: Handle incoming web-push events via VAPID setup. Deps: 16.1.

## Phase 17: Price Alerts & Cron Job
- [ ] 17.1 Implement Alerts UI & Store — Files: `src/core/domain/entities/PriceAlert.ts`, `src/app/(dashboard)/alerts/page.tsx`, `src/ui/organisms/AlertForm.tsx`, `src/ui/molecules/AlertCard.tsx`, `src/app/api/alerts/route.ts`. AC: Enable user creation/deletion of threshold condition alerts. Deps: 13.1.
- [ ] 17.2 Build Background Polling Cron Job — Files: `src/core/use-cases/CheckAndTriggerAlerts.ts`, `src/app/api/cron/check-alerts/route.ts`. AC: Every 5 min, fetches active alerts, calls Alpha Vantage optimally, triggers notifications/push, protected by CRON_SECRET. Deps: 16.3, 17.1.
