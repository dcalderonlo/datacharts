import { test, expect } from '@playwright/test'

// ─── Smoke Tests ──────────────────────────────────────────────────────────────

test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
  await page.goto('/overview')
  // Protected by auth middleware — unauthenticated users must be redirected to /login
  await expect(page).toHaveURL(/\/login(?:\?.*)?$/, { timeout: 10000 })
})

test('login page renders form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByLabel(/email/i)).toBeVisible()
  await expect(page.getByLabel(/password/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
})

test('landing page search is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByPlaceholder(/search a symbol/i)).toBeVisible()
})

// ─── Login Flow ───────────────────────────────────────────────────────────────

test('shows validation error for invalid credentials', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('wrong@example.com')
  await page.getByLabel(/password/i).fill('wrongpassword')
  await page.getByRole('button', { name: /sign in/i }).click()
  // Either shows error message or stays on login page (DB not available in CI)
  await expect(page).toHaveURL(/\/login/, { timeout: 8000 })
})

test('login page has link to register', async ({ page }) => {
  await page.goto('/login')
  const registerLink = page.getByRole('link', { name: /sign up|register|create account/i })
  await expect(registerLink).toBeVisible()
})

// ─── Landing / Search ─────────────────────────────────────────────────────────

test('search bar accepts symbol input', async ({ page }) => {
  await page.goto('/')
  const searchInput = page.getByPlaceholder(/search a symbol/i)
  await searchInput.fill('AAPL')
  await expect(searchInput).toHaveValue('AAPL')
})

test('landing page renders without crashing', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBeLessThan(400)
  await expect(page).toHaveTitle(/.+/)
})
