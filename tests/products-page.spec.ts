import { test, expect } from '@playwright/test'

test('products page should contain an image in the link', async ({ page }) => {
  await page.goto(`/products`)
  const link = await page.getByRole('link', {
    name: 'Forzudo Blanco Forzudo Blanco Bierzo, Leon, Nordvest Spanien 100 cl. / 15%',
  })
  const image = await link.locator('img').first()
  expect(image).toBeTruthy()
})
