import { test, expect } from '@playwright/test'

test('main-page displayed must have the logo image, title, and at least 1 image in the carrousel', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const logoImage = await page.locator('a[title="logo"] img[alt="logo"]').first()
  expect(logoImage).toBeTruthy()
  await page.getByTestId('carrousel').click()
  const pageTitle = await page.title()
  expect(pageTitle).toContain('Vermouth.NU')

  const carouselImages = await page.locator('div:has(img)').all()
  expect(carouselImages.length).toBeGreaterThan(0)
})
