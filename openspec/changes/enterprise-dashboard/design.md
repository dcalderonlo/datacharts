# Design: Enterprise Dashboard

## Technical Approach

Next.js App Router como presentation layer, llamando use-cases del dominio puro directamente desde Server Components (sin HTTP round-trip interno). Alpha Vantage se consume exclusivamente server-side via Route Handlers. Zustand maneja estado client-side con factory pattern SSR-safe. Atomic Design mapea 1:1 a la jerarquía de componentes. Monetización basada en ads no intrusivos y conversión de usuarios anónimos limitados a cuentas autenticadas completas con alertas de precio, watchlists, y notificaciones.

---

## Architecture Decisions

| Decisión | Elección | Descartado | Razón |
|----------|----------|-----------|-------|
| Router | App Router | Pages Router | Nested layouts, streaming, Server Components nativos |
| Auth | NextAuth.js v5 | Custom JWT | Session management, providers, middleware built-in |
| State | Zustand + slice pattern | Redux Toolkit | Menor boilerplate, SSR-safe con factory, TypeScript nativo |
| Styling | TailwindCSS | CSS Modules / styled-components | Utility-first, purge automático, design tokens nativos |
| Animaciones | Framer Motion | CSS transitions | API declarativa, AnimatePresence para chart transitions |
| Charts | Chart.js + react-chartjs-2 | Recharts / D3 | Rendimiento, customización, registro granular de componentes |
| Testing | Vitest + RTL + MSW + Playwright | Jest | Vitest es más rápido en ESM, MSW para mock de Alpha Vantage |
| Containerización | Docker multi-stage | — | Builder + runner, imagen final ~150MB |
| Anon Tracking | HttpOnly Cookie | LocalStorage | Prevenir manipulación client-side del límite de búsquedas anónimas |
| Alertas | Vercel Cron / GitHub Actions | Long-running process | Next.js serverless architecture requiere endpoints disparados externamente |
| Push Notifications | Web Push API (VAPID) | Firebase FCM | Nativo web, sin vendor lock-in, suscripción almacenada en DB |

---

## Data Flow

```
Browser (Client)
    │
    ├── Zustand Store (market/auth/ui/watchlist/notification slices)
    │       └── hydrated from Server → Client via props
    │
Next.js App Router
    │
    ├── Server Components (Overview, Analytics, Reports, Landing, Alerts)
    │       └── llamar use-cases directamente (no fetch interno)
    │
    ├── Route Handlers (/api/market/*, /api/alerts, /api/notifications, /api/push/*)
    │       └── AlphaVantageClient → Adapter → Mapper → Domain Entity → JSON
    │
    ├── Cron Job Handler (/api/cron/check-alerts)
    │       └── Protegido por CRON_SECRET → Lee alertas → Llama Alpha Vantage → Web Push / In-App Notif
    │
    └── Middleware (auth guard en /dashboard/*, cookie injection/validation en `/`)

Alpha Vantage API  (server-side only, API key en env)
    Raw: { "Global Quote": { "1. symbol": "AAPL", "2. open": "150.00" } }
    Mapped: { symbol: "AAPL", open: 150.00, ... } → Quote entity
```

---

## Folder Structure

```
src/
├── app/
│   ├── (public)/
│   │   └── page.tsx        # Landing: ads, public indices, 3-search limit
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── overview/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── alerts/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── market/...
│   │   ├── auth/register/route.ts
│   │   ├── alerts/route.ts
│   │   ├── notifications/...
│   │   ├── push/subscribe/route.ts
│   │   └── cron/check-alerts/route.ts
│   └── layout.tsx
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Quote.ts
│   │   │   ├── PriceAlert.ts
│   │   │   ├── Watchlist.ts
│   │   │   ├── Notification.ts
│   │   │   └── PushSubscription.ts
│   │   └── ports/
│   │       ├── IMarketRepository.ts
│   │       ├── IAlertRepository.ts
│   │       └── INotificationRepository.ts
│   └── use-cases/
│       ├── CreatePriceAlert.ts
│       ├── CheckAndTriggerAlerts.ts
│       ├── AddToWatchlist.ts
│       ├── CreateNotification.ts
│       └── ...
├── infrastructure/
│   ├── alpha-vantage/...
│   ├── database/
│   │   └── prisma/schema.prisma   # Prisma adapter para Auth, Alerts, Watchlists
│   └── push/
│       └── web-push.ts
├── ui/
│   ├── atoms/          # Button, BellIcon, ...
│   ├── molecules/      # MetricCard, AlertCard, WatchlistItem, AdBanner
│   ├── organisms/      # MarketChart, AlertForm, NotificationPanel, WatchlistPanel
│   └── ...
└── store/
    ├── market.slice.ts
    ├── auth.slice.ts
    ├── watchlist.slice.ts
    ├── notification.slice.ts
    └── index.ts
```

---

## Interfaces / Contracts / Schema

### Prisma Schema (Deltas)

```prisma
model Watchlist {
  id        String   @id @default(cuid())
  userId    String
  symbol    String
  addedAt   DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, symbol])
}

model PriceAlert {
  id          String    @id @default(cuid())
  userId      String
  symbol      String
  targetPrice Float
  condition   String    // 'above' | 'below'
  triggered   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  triggeredAt DateTime?
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String    @id @default(cuid())
  userId    String
  title     String
  message   String
  read      Boolean   @default(false)
  createdAt DateTime  @default(now())
  alertId   String?
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// + Relaciones Inversas en User
```

### Environment Variables (.env)
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your@email.com
CRON_SECRET=your_cron_secret
```

---

## API Route Error Contract

```typescript
// Éxito
{ data: T }

// Error
{ error: string, code: 'RATE_LIMIT' | 'NOT_FOUND' | 'UPSTREAM_ERROR' | 'UNAUTHORIZED', retryAfter?: number }
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  ci:
    steps:
      - tsc --noEmit          # type check
      - eslint .              # lint
      - vitest run            # unit tests
      - next build            # production build
      - docker build          # multi-stage image
      - vercel --prod         # deploy (solo si todo pasa)
```

**Dockerfile** (multi-stage):
- Stage 1 `builder`: `node:20-alpine`, instala deps, `next build`
- Stage 2 `runner`: copia `.next/standalone`, expone 3000

---

## Testing Strategy

| Layer | Qué testear | Herramienta |
|-------|-------------|-------------|
| Unit | Mappers, use-cases (alerts cron), Zustand slices | Vitest |
| Component | Atoms y molecules en aislamiento | RTL + Vitest |
| Integration | Route Handlers (/api/cron/check-alerts) con Alpha Vantage mockeado | MSW + Vitest |
| E2E | Login flow, public landing limit, dashboard load, chart render | Playwright |

---

## Open Questions

- [ ] ¿Rate limit de Alpha Vantage (5 req/min free tier) limitará la efectividad del Cron Job que agrupa y pollea `CheckAndTriggerAlerts` si hay múltiples símbolos activos distintos? (Podríamos necesitar planchar el agrupamiento de Alpha Vantage endpoints y priorizar.)
- [ ] ¿Dónde exactamente ubicamos los AdBanners para que sean no intrusivos en las rutas públicas vs la interfaz del panel autenticado?
