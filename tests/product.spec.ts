import { test, expect } from '@playwright/test'

test('check img and texts', async ({ page }) => {
  await page.goto(`http://localhost:5173/products/sardino-rojo`)
  await page.getByRole('heading', { name: 'Sardino Rojo' }).click()

  const titleElement = await page.$('h1')
  expect(titleElement).toBeTruthy()

  await page.getByRole('img', { name: 'Sardino Rojo' }).click()

  const imgElement = await page.$('img[alt="Sardino Rojo"]')
  expect(imgElement).toBeTruthy()

  await page.getByTestId('product').click()

  const pageText = await page.textContent('body')
  expect(pageText).not.toBeNull()
})
