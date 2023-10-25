import { test, expect } from '@playwright/test'

test('check images and logo text', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByTestId('title').click()

  const pageTitle = await page.title()
  expect(pageTitle).toContain('Vermouth.NU')

  const logoImage = await page.locator('a[title="logo"] img[alt="logo"]').first()
  expect(logoImage).toBeTruthy()
  await page.getByTestId('carrousel').click()

  const carouselImages = await page.locator('div:has(img)').all()
  expect(carouselImages.length).toBeGreaterThan(0)
})
