import { test, expect } from '@playwright/test'

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
