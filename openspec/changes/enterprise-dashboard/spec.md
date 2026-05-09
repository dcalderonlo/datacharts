# Specification: Enterprise Dashboard

## Domain: User Auth

### ADDED Requirements

#### Requirement: Authentication Flows (FR-01)
The system MUST provide secure authentication flows including login, session management, and logout.
The system MUST restrict access to dashboard routes to authenticated users only.

##### Scenario: Login flow
- GIVEN an unauthenticated user on the login page
- WHEN the user enters valid credentials and submits
- THEN the system MUST establish a secure session
- AND redirect the user to the Overview page

#### Requirement: Registration Flow
The system MUST provide a Registration page at `/register` to allow new users to create an account.
The system MUST hash passwords using `bcryptjs` before storage.

##### Scenario: Successful registration
- GIVEN an unauthenticated user on the `/register` page
- WHEN the user provides a valid name, email, password, and confirmation
- THEN the system MUST create the user account and log them in
- AND redirect to the Overview page

## Domain: Market Monitoring

### ADDED Requirements

#### Requirement: Overview Page (FR-02)
The system MUST provide an Overview page displaying KPI cards, real-time quotes, and a market pulse.

##### Scenario: Viewing real-time quote
- GIVEN an authenticated user on the Overview page
- WHEN the dashboard requests the latest market data
- THEN the real-time quote card MUST display the latest Alpha Vantage data via the Adapter + Mapper pattern

#### Requirement: Analytics Page (FR-03, FR-10)
The system MUST provide an Analytics page with interactive Chart.js charts displaying volatility and trends.
The system MUST animate chart transitions using Framer Motion.

##### Scenario: Chart rendering with Framer Motion animation
- GIVEN an authenticated user on the Analytics page
- WHEN a new dataset is selected for viewing
- THEN the Chart.js visualization MUST smoothly transition using Framer Motion

#### Requirement: External Integrations & Data Handling (FR-05, FR-06, FR-08)
The system MUST integrate with Alpha Vantage for market data (quotes, indices, company profile, volatility).
The system MUST process responses using a strict Adapter + Mapper pattern.
The system MUST support real-time data refresh via polling or manual refresh.

##### Scenario: Rate limit exceeded handling (NFR-07, NFR-08)
- GIVEN the application requesting data from Alpha Vantage
- WHEN the 5 req/min free tier rate limit is exceeded
- THEN the system MUST catch the error via error boundaries
- AND display a user-friendly rate limit warning without crashing the UI

## Domain: Public Access & Monetization

### ADDED Requirements

#### Requirement: Public Landing Page
The system MUST expose the `/` route as a public landing page displaying market indices, top movers, partial chart previews, and ads.
The system MUST provide Call-To-Action (CTA) buttons for Sign In and Account Creation.

##### Scenario: Anonymous user on landing
- GIVEN an unauthenticated user
- WHEN they navigate to `/`
- THEN the system MUST render the public landing page without redirecting to `/overview`

#### Requirement: Anonymous Search Rate Limiting
The system MUST limit unauthenticated users to 3 symbol searches per day.
The system MUST track anonymous search count via an `httpOnly` cookie (`anon_search_count` and `anon_search_date`) to prevent client-side manipulation.

##### Scenario: Exceeding daily search limit
- GIVEN an unauthenticated user who has performed 3 searches today
- WHEN the user attempts a 4th search
- THEN the system MUST block the search and display a "Create account for unlimited searches" banner

## Domain: User Personalization

### ADDED Requirements

#### Requirement: Watchlist
The system MUST allow authenticated users to add and remove symbols from a personal Watchlist.
The system MUST display the Watchlist in a dedicated section on the Overview page.

##### Scenario: Adding to watchlist
- GIVEN an authenticated user viewing a quote panel
- WHEN the user clicks the "Add to Watchlist" button
- THEN the system MUST save the symbol to their Watchlist and update the UI state

#### Requirement: Price Alerts
The system MUST allow authenticated users to create target price alerts (above/below condition) for specific symbols via the `/alerts` page.
The system MUST poll Alpha Vantage every 5 minutes via a secure cron job route to evaluate active alerts.

##### Scenario: Alert condition met
- GIVEN an active alert for AAPL > 150
- WHEN the cron job fetches a current price of 152 for AAPL
- THEN the system MUST mark the alert as triggered and create a notification

## Domain: Notifications

### ADDED Requirements

#### Requirement: In-App Notifications
The system MUST generate and display in-app notifications (e.g., for triggered alerts).
The system MUST display a bell icon with an unread badge count in the Navigation Sidebar, opening a Notification Panel.

##### Scenario: Marking notifications read
- GIVEN a user with 2 unread notifications
- WHEN the user clicks "Mark all read" in the Notification Panel
- THEN the system MUST update the notifications as read in the database and clear the badge

#### Requirement: Web Push Notifications
The system MUST support web push notifications via a service worker and VAPID keys for triggered alerts.

##### Scenario: Receiving push notification
- GIVEN an authenticated user subscribed to push notifications
- WHEN an alert triggers in the background cron job
- THEN the system MUST dispatch a web push notification to the user's registered endpoint

## Domain: Reporting

### ADDED Requirements

#### Requirement: Reports Page (FR-04)
The system MUST provide a Reports page allowing users to view and export data summaries.

## Domain: System Configuration & UI State

### ADDED Requirements

#### Requirement: Zustand Slice Pattern (FR-07)
The system MUST implement a Zustand slice pattern containing market, auth, and UI slices, and now watchlist and notification slices.

#### Requirement: Responsive UI (FR-09)
The system MUST implement a fully responsive design using TailwindCSS.

## Non-Functional Requirements

- **NFR-01**: API keys MUST NEVER be exposed to the client; all Alpha Vantage communication MUST occur server-side.
- **NFR-02**: Zustand store MUST use the factory pattern + `useRef` provider to prevent SSR state leakage.
- **NFR-03**: The codebase MUST enforce TypeScript strict mode.
- **NFR-04**: The application MUST be containerized using Docker.
- **NFR-05**: The system MUST deploy via CI/CD (GitHub Actions) to Vercel.
- **NFR-06**: Chart.js components MUST be loaded client-side only (dynamic import with `ssr: false`).
- **NFR-07**: The Alpha Vantage integration MUST handle the 5 req/min free tier rate limit gracefully.
- **NFR-08**: The UI MUST implement error boundaries to catch failed API calls.

##### Scenario: Docker build succeeds
- GIVEN a pull request or commit pushed to the repository
- WHEN the GitHub Actions CI pipeline runs
- THEN the Docker container MUST build successfully

##### Scenario: CI pipeline passes -> Vercel deploy triggers
- GIVEN a push to the main branch
- WHEN the GitHub Actions CI pipeline passes successfully
- THEN the Vercel deployment MUST trigger automatically
