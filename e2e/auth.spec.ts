import { test, expect } from '@playwright/test'

// ─── Smoke Tests ──────────────────────────────────────────────────────────────

test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('login page renders form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByPlaceholder(/email/i)).toBeVisible()
  await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
})

test('landing page search is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByPlaceholder(/search a symbol/i)).toBeVisible()
})

// ─── Login Flow ───────────────────────────────────────────────────────────────

test('shows validation error for invalid credentials', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder(/email/i).fill('wrong@example.com')
  await page.getByPlaceholder(/password/i).fill('wrongpassword')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page.getByText(/invalid credentials|error/i)).toBeVisible({ timeout: 5000 })
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
