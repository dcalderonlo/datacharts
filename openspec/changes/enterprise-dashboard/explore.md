# Exploration: enterprise-dashboard

**Change**: enterprise-dashboard
**Date**: 2026-05-07
**Author**: sdd-explore agent
**Project**: datacharts (Greenfield)

---

## Current State

This is a **greenfield project** — no existing code, no stack, no conventions. Every decision is a first-principles choice. The SDD context has been initialized (openspec/ and .atl/ exist) but no implementation has started. This exploration document defines the technical foundation for the entire project.

---

## 1. Next.js App Router vs Pages Router

### Comparison

| Dimension | App Router (v13+) | Pages Router (legacy) |
|-----------|------------------|----------------------|
| SSR model | React Server Components + Streaming | `getServerSideProps` per page |
| Zustand compatibility | Works fine — Zustand lives in Client Components | Works natively |
| Data fetching | `async` Server Components, `fetch` with caching | `getServerSideProps`, `getStaticProps` |
| Layout system | Nested layouts (layout.tsx) — DRY | `_app.tsx` + manual wrapping — repetitive |
| Error boundaries | `error.tsx` per segment | `_error.tsx` global |
| Loading states | `loading.tsx` per segment | Manual loaders |
| Streaming | Built-in with Suspense | Not supported |
| Stability | Stable since Next.js 13.4 | Mature, well-documented |
| Learning curve | Higher (RSC mental model) | Lower |
| Enterprise fit | Superior — composable, performant | Adequate but dated |

### Recommendation: **App Router**

For an enterprise dashboard, the App Router is the clear winner:
- Nested layouts eliminate boilerplate in dashboards (sidebar + header stay mounted)
- Streaming lets charts load progressively — critical for heavy data viz pages
- Server Components allow server-side data fetching without client bundles bloating
- Per-segment `loading.tsx` / `error.tsx` gives granular UX control

**Zustand + App Router**: Zustand stores must live in Client Components or be initialized in a Provider. The pattern is: create a store factory (not a singleton), wrap in a `StoreProvider` client component at the root layout, and hydrate on the client. This avoids SSR singleton leakage across requests.

---

## 2. Hexagonal Architecture Folder Structure

### Recommended Structure

```
src/
├── app/                          # Next.js App Router (entry/framework layer)
│   ├── (dashboard)/              # Route group — dashboard layout
│   │   ├── layout.tsx
│   │   ├── overview/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── reports/page.tsx
│   ├── api/                      # Route Handlers (HTTP adapters)
│   │   ├── metrics/route.ts
│   │   └── reports/route.ts
│   ├── layout.tsx                # Root layout
│   └── providers.tsx             # Client-side providers (Zustand, React Query)
│
├── core/                         # DOMAIN layer — pure business logic, no framework deps
│   ├── entities/                 # Domain types and entities
│   │   ├── metric.entity.ts
│   │   └── report.entity.ts
│   ├── ports/                    # Interfaces (input/output ports)
│   │   ├── metrics.repository.ts
│   │   └── metrics.service.ts
│   └── use-cases/                # Application logic
│       ├── get-metrics.use-case.ts
│       └── generate-report.use-case.ts
│
├── infrastructure/               # ADAPTERS layer — external systems
│   ├── http/                     # External API clients
│   │   └── metrics-api.client.ts
│   ├── repositories/             # Port implementations
│   │   └── metrics.repository.impl.ts
│   └── mock/                     # Mock adapters for dev/test
│       └── metrics.repository.mock.ts
│
├── ui/                           # PRESENTATION layer (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── providers/
│       └── store-provider.tsx
│
├── store/                        # Zustand global state
│   ├── index.ts
│   ├── slices/
│   │   ├── metrics.slice.ts
│   │   └── ui.slice.ts
│   └── middleware/
│       └── devtools.ts
│
└── lib/                          # Shared utilities, constants, types
    ├── constants.ts
    ├── utils.ts
    └── types.ts
```

**Key principle**: `core/` has ZERO imports from `app/`, `infrastructure/`, or `ui/`. Dependency arrows point inward. Framework code depends on core; core knows nothing about Next.js.

---

## 3. Atomic Design Mapping to App Router

### Mapping

| Atomic Level | Location | Role in Next.js |
|-------------|----------|----------------|
| **Atoms** | `src/ui/atoms/` | Primitive UI (Button, Badge, Icon, Input) — pure presentational, no state |
| **Molecules** | `src/ui/molecules/` | Composite UI (MetricCard, ChartLegend, FilterGroup) — may have local state |
| **Organisms** | `src/ui/organisms/` | Full sections (MetricsDashboard, DataTable, ChartPanel) — connect to store |
| **Templates** | `src/ui/templates/` | Layout shells (DashboardTemplate, ReportTemplate) — purely structural |
| **Pages** | `src/app/**/page.tsx` | Next.js pages — compose templates + organisms, handle data fetching |

### Key Conventions

- Atoms and Molecules: **NEVER** import from Zustand store — pure props-driven
- Organisms: **MAY** connect to Zustand via hooks
- Templates: Accept children/slots — no data awareness
- Pages (`app/*/page.tsx`): Server Components by default; may be async; call use-cases or fetch directly
- Each component folder: `index.ts` + `Component.tsx` + `Component.stories.tsx` + `Component.test.tsx`

```
ui/atoms/Button/
├── index.ts
├── Button.tsx
├── Button.stories.tsx
└── Button.test.tsx
```

---

## 4. Zustand Store Design Patterns

### Architecture: Slice Pattern + Separate Stores

**Recommended**: Multiple focused stores over one monolithic store.

```typescript
// store/slices/metrics.slice.ts
import { StateCreator } from 'zustand'

export interface MetricsSlice {
  metrics: Metric[]
  isLoading: boolean
  error: string | null
  fetchMetrics: (filters: MetricFilters) => Promise<void>
  clearMetrics: () => void
}

export const createMetricsSlice: StateCreator<MetricsSlice> = (set) => ({
  metrics: [],
  isLoading: false,
  error: null,
  fetchMetrics: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const data = await metricsService.getMetrics(filters)
      set({ metrics: data, isLoading: false })
    } catch (e) {
      set({ error: e.message, isLoading: false })
    }
  },
  clearMetrics: () => set({ metrics: [] }),
})
```

```typescript
// store/index.ts — combined store with devtools + immer
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type RootStore = MetricsSlice & UISlice

export const useStore = create<RootStore>()(
  devtools(
    immer((...args) => ({
      ...createMetricsSlice(...args),
      ...createUISlice(...args),
    })),
    { name: 'enterprise-dashboard' }
  )
)
```

### SSR-Safe Store Pattern (App Router)

```typescript
// ui/providers/store-provider.tsx
'use client'
import { useRef } from 'react'
import { StoreContext } from '@/store/context'
import { createStore } from '@/store'

export function StoreProvider({ children, initialState }) {
  const storeRef = useRef<ReturnType<typeof createStore>>()
  if (!storeRef.current) {
    storeRef.current = createStore(initialState)
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}
```

**Why `useRef`?** Prevents re-creating the store on every render. The factory pattern (not singleton) ensures each SSR request gets its own store instance — no cross-request state leakage.

### Middleware Stack

```
devtools → persist (optional, for UI preferences) → immer (optional, for complex state)
```

- **devtools**: Always in dev. Wrap with `process.env.NODE_ENV !== 'production'` guard
- **persist**: Only for UI state (theme, sidebar collapse) — NEVER persist sensitive metric data
- **immer**: Recommended for deeply nested state mutations

---

## 5. Chart.js Integration with Next.js SSR

### The Problem

Chart.js uses browser APIs (`canvas`, `window`, `document`). Server Components cannot render Chart.js — they will throw `ReferenceError: document is not defined`.

### Solution: Client-Only Rendering via `react-chartjs-2`

```typescript
// ui/organisms/MetricsChart/MetricsChart.tsx
'use client'  // ← REQUIRED — marks this as Client Component

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
)

export function MetricsChart({ data, options }: MetricsChartProps) {
  return <Line data={data} options={options} />
}
```

### Dynamic Import for Code Splitting (Recommended)

```typescript
// In a Server Component page:
import dynamic from 'next/dynamic'

const MetricsChart = dynamic(
  () => import('@/ui/organisms/MetricsChart').then(m => m.MetricsChart),
  {
    ssr: false,       // ← prevents SSR entirely for this component
    loading: () => <ChartSkeleton />  // ← shown while JS loads
  }
)
```

**Why `ssr: false`?** Even `'use client'` components are pre-rendered on the server in Next.js (hydration). Setting `ssr: false` completely skips server rendering for Chart.js components — this is the correct pattern for canvas-based libraries.

### Chart.js Alternatives Considered

| Library | SSR-friendly | Bundle size | Interaction |
|---------|-------------|-------------|-------------|
| Chart.js + react-chartjs-2 | ❌ (client-only) | ~200KB | Good |
| Recharts | ✅ (SVG-based) | ~160KB | Good |
| Victory | ✅ (SVG-based) | ~200KB | Good |
| Nivo | ✅ (SVG/canvas) | ~300KB | Excellent |
| Tremor | ✅ (built on Recharts) | ~180KB | Good + DX |

**Recommendation**: Stick with Chart.js per user request. Use `ssr: false` dynamic imports. Consider **Tremor** as a future enhancement for pre-built dashboard components.

---

## 6. Backend Patterns: API Routes vs Route Handlers

### Next.js App Router: Use Route Handlers

Route Handlers (`app/api/*/route.ts`) are the App Router equivalent of Pages Router API routes. They support the Web Request/Response API natively.

```typescript
// app/api/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GetMetricsUseCase } from '@/core/use-cases/get-metrics.use-case'
import { MetricsRepositoryImpl } from '@/infrastructure/repositories/metrics.repository.impl'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = parseFilters(searchParams)

  const repo = new MetricsRepositoryImpl()
  const useCase = new GetMetricsUseCase(repo)

  try {
    const metrics = await useCase.execute(filters)
    return NextResponse.json({ data: metrics })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
```

### Data Fetching Layers

```
┌─────────────────────────────────────────────────────┐
│  Server Component Page (async)                      │
│  → calls use case directly (no HTTP round-trip)     │
│  → OR fetches from internal Route Handler           │
└─────────────────────────────────────────────────────┘
          ↕
┌─────────────────────────────────────────────────────┐
│  Route Handler (app/api/*)                          │
│  → HTTP adapter for external clients / Zustand      │
│  → calls use cases                                  │
└─────────────────────────────────────────────────────┘
          ↕
┌─────────────────────────────────────────────────────┐
│  Use Case (core/use-cases/)                         │
│  → pure business logic, no HTTP knowledge           │
└─────────────────────────────────────────────────────┘
          ↕
┌─────────────────────────────────────────────────────┐
│  Repository (infrastructure/repositories/)          │
│  → implements port, fetches from external APIs/DB   │
└─────────────────────────────────────────────────────┘
```

**Best practice for Server Components**: Call use cases directly — skip the HTTP round-trip. Only expose Route Handlers for client-side mutations (Zustand actions calling fetch) or external consumer APIs.

---

## 7. TypeScript Setup and Conventions

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Key settings
- `strict: true` — non-negotiable for enterprise
- `noUncheckedIndexedAccess: true` — catches array/object access bugs
- `exactOptionalPropertyTypes: true` — prevents `undefined` masquerading as absent props
- `paths: @/*` — clean imports, no `../../../`

### Conventions
- `*.entity.ts` — domain entities with type + validation
- `*.port.ts` — interfaces (input/output ports)
- `*.use-case.ts` — application logic
- `*.repository.ts` — repository interfaces
- `*.repository.impl.ts` — implementations
- `*.slice.ts` — Zustand slices
- Component files: PascalCase (`MetricsChart.tsx`)
- Utility files: camelCase (`formatDate.ts`)
- Types exported from `lib/types.ts` or co-located with their domain

---

## 8. Testing Strategy

### Recommended Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | **Vitest** | Use cases, entities, utilities — fast, ESM-native |
| Component | **React Testing Library** + Vitest | UI components in isolation |
| Integration | **Vitest** + MSW (Mock Service Worker) | API calls, store + component integration |
| E2E | **Playwright** | Critical user flows (dashboard load, filter interactions) |
| Visual | **Storybook** + Chromatic (optional) | Component visual regression |

### Setup

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom msw playwright @playwright/test
```

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

### Testing Philosophy
- **Core (use-cases, entities)**: 100% unit test coverage target — no mocks needed, pure functions
- **Organisms**: Integration tests with mock store
- **Atoms/Molecules**: Snapshot + interaction tests
- **Pages**: Playwright E2E for critical flows
- **Chart components**: Render test only (no visual assertion) + Storybook

---

## 9. Recommended Dependencies

### Production

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "zustand": "4.x",
    "chart.js": "4.x",
    "react-chartjs-2": "5.x",
    "immer": "10.x",
    "zod": "3.x",
    "date-fns": "3.x",
    "clsx": "2.x",
    "tailwind-merge": "2.x"
  }
}
```

### Development

```json
{
  "devDependencies": {
    "typescript": "5.x",
    "@types/node": "20.x",
    "@types/react": "18.x",
    "@types/react-dom": "18.x",
    "tailwindcss": "3.x",
    "postcss": "8.x",
    "autoprefixer": "10.x",
    "eslint": "8.x",
    "eslint-config-next": "14.x",
    "@typescript-eslint/eslint-plugin": "7.x",
    "prettier": "3.x",
    "vitest": "1.x",
    "@vitejs/plugin-react": "4.x",
    "jsdom": "24.x",
    "@testing-library/react": "15.x",
    "@testing-library/user-event": "14.x",
    "@testing-library/jest-dom": "6.x",
    "msw": "2.x",
    "@playwright/test": "1.x",
    "storybook": "8.x"
  }
}
```

### Notes on choices
- **Zod**: Schema validation at the boundary (API response parsing, form validation) — not deep in core
- **date-fns**: Tree-shakeable, TypeScript-first date library for dashboard date ranges
- **clsx + tailwind-merge**: Standard combo for conditional Tailwind classes in components
- **MSW v2**: Intercepts fetch at the network level, works in browser + Node/Vitest
- **pnpm**: Recommended package manager (faster, strict, monorepo-ready if needed)

---

## 10. Risk Areas and Mitigation Strategies

### Risk 1: Zustand SSR State Leakage
**Risk**: Using a Zustand singleton in App Router leaks state across concurrent SSR requests.
**Mitigation**: Store factory pattern + `StoreProvider` with `useRef` (documented in §4). NEVER call `create()` at module level without the factory pattern.

### Risk 2: Chart.js `document is not defined` in SSR
**Risk**: Importing Chart.js in a Server Component or forgetting `ssr: false` causes build/runtime errors.
**Mitigation**: All chart components MUST have `'use client'` directive AND be dynamically imported with `{ ssr: false }`. Enforce via ESLint rule (custom or eslint-plugin-next).

### Risk 3: Atomic Design Discipline Breaking Down
**Risk**: Developers start importing store in Atoms/Molecules, breaking the architecture.
**Mitigation**: ESLint import rules to forbid `zustand` imports in `ui/atoms/**` and `ui/molecules/**`. Document the rule in a `CONTRIBUTING.md`.

### Risk 4: Over-fetching in Client Components
**Risk**: Zustand actions fetch data on every component mount, causing waterfalls.
**Mitigation**: Use Server Components for initial data load; pass data as props to Client Components. Use React Query or SWR as a caching layer on top of Zustand for server data (or Zustand + stale-while-revalidate pattern).

### Risk 5: Bundle Size from Chart.js
**Risk**: Chart.js tree-shaking requires manual registration — forgetting to tree-shake bloats the bundle.
**Mitigation**: Always import and register only needed Chart.js components (shown in §5). Use Next.js bundle analyzer (`@next/bundle-analyzer`) to verify.

### Risk 6: TypeScript Strictness Relaxation Under Deadline
**Risk**: `any` types and `@ts-ignore` accumulate under time pressure.
**Mitigation**: `eslint-plugin-typescript` with `no-explicit-any: error`. PR reviews must reject `any` without documented justification.

### Risk 7: Hexagonal Architecture Boundaries Eroding
**Risk**: `core/` starts importing from Next.js or `infrastructure/` (dependency inversion violation).
**Mitigation**: ESLint `no-restricted-imports` rules. CI check on `core/` that it has zero framework imports. Architectural tests (can validate with Vitest + manual import checks).

---

## Approaches Summary

### Approach A: Full Clean Architecture (Recommended)
- App Router + RSC + Streaming
- Hexagonal `core/` / `infrastructure/` / `ui/` structure
- Zustand factory pattern with slice pattern
- Chart.js with `ssr: false` dynamic import
- Vitest + RTL + Playwright testing
- **Effort**: High (setup) — pays off immediately in maintainability
- **Risk**: Higher initial complexity, team needs architecture orientation

### Approach B: Simpler "Flat" Architecture
- App Router + minimal folder structure
- Zustand flat store
- Chart.js same pattern
- No hexagonal layers — use cases inline in pages/route handlers
- **Effort**: Low
- **Risk**: Technical debt accumulates fast for enterprise scale; refactor becomes painful at 6+ months

**Recommendation: Approach A** — this is an **enterprise** dashboard. The investment in proper architecture pays compound interest. Approach B is tech debt from day 1.

---

## Recommendation

**Build this with the App Router + full hexagonal architecture from the start.** The folder structure defined in §2 is production-ready and scales to 50+ pages without friction. The Zustand factory pattern is non-negotiable for SSR safety. Chart.js works fine with `ssr: false` — it's a solved problem.

**Critical path for first sprint:**
1. Scaffold Next.js 14 with TypeScript strict mode
2. Set up folder structure (core/infrastructure/ui/store)
3. Configure ESLint + Prettier + import boundary rules
4. Add Vitest + Playwright
5. Build first use case (e.g., `get-metrics`) with mock repository
6. Build first organisms (MetricsChart, MetricCard)
7. Wire Zustand store with StoreProvider

---

## Risks

1. **Zustand SSR singleton leakage** — use factory pattern (HIGH priority)
2. **Chart.js SSR crashes** — always `ssr: false` (HIGH priority)
3. **Atomic Design boundary violations** — enforce via ESLint (MEDIUM)
4. **Bundle size from Chart.js** — tree-shake registrations (MEDIUM)
5. **Hexagonal boundary erosion** — ESLint import rules + CI (MEDIUM)
6. **`any` type accumulation** — ESLint `no-explicit-any: error` (MEDIUM)

---

## Ready for Proposal

**Yes** — exploration is complete. Enough clarity to write a full proposal, spec, and design.

**Orchestrator instructions**: Proceed to `sdd-propose` with this exploration as context. The proposal should define:
- MVP scope (which metrics, which chart types, which pages)
- Data sources (mock vs real API)
- Authentication requirements (out of scope for v1 or included?)
- Deployment target (Vercel, Docker, etc.)

These are the remaining unknowns that need user input before specs can be written.
