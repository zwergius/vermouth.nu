import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  const link = await page.getByRole('link', {
    name: 'Forzudo Blanco Forzudo Blanco Bierzo, Leon, Nordvest Spanien 100 cl. / 15%',
  })
  const image = await link.locator('img').first()

  expect(image).toBeTruthy()
})
