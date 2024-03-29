import { test, expect } from '@playwright/test'

test('product page should show an h1, a paragraph and that there is an image', async ({ page }) => {
  await page.goto('/products/sardino-rojo')
  await page.waitForLoadState('networkidle')
  await page.getByRole('heading', { name: 'Sardino Rojo' }).click()
  const titleElement = await page.$('h1')
  expect(titleElement).toBeTruthy()

  await page.getByRole('img', { name: 'Sardino Rojo' }).click()
  const imgElement = await page.$('img[alt="Sardino Rojo"]')
  expect(imgElement).toBeTruthy()

  await page.click('[data-testid="introText"]')
  await page.waitForSelector('p')
  const paragraphExists = await page.$('p')
  expect(paragraphExists).toBeTruthy()
})
