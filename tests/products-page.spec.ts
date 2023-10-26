import { test, expect } from '@playwright/test'

test('products page should contain an image in the link', async ({ page }) => {
  await page.goto(`/products`)
  const link = await page.locator('a').first()
  const image = await link.locator('img').first()
  expect(image).toBeTruthy()
})
