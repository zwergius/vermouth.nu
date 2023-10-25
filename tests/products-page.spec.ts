import { test, expect } from '@playwright/test'

test('check if they contain the image', async ({ page }) => {
  await page.goto(`/products`)

  const link = await page.getByRole('link', {
    name: 'Forzudo Blanco Forzudo Blanco Bierzo, Leon, Nordvest Spanien 100 cl. / 15%',
  })
  const image = await link.locator('img').first()
  expect(image).toBeTruthy()
})
