import { expect, test } from '@playwright/test'

test('mobile menu opens, navigates, and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const menuButton = page.getByRole('button', { name: 'Navigations menu' })
  await expect(menuButton).toBeVisible()

  await menuButton.click()
  await expect(page.getByRole('link', { name: 'Sortiment' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Smagninger' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Inspiration' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Forhandlere' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Om Os' })).toBeVisible()

  await page.getByRole('link', { name: 'Sortiment' }).click()
  await expect(page).toHaveURL(/\/sortiment$/)
  await expect(page.getByRole('link', { name: 'Sortiment' })).toBeHidden()
})
