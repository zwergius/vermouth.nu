import { test, expect } from '@playwright/test'

test('check images and logo text', async ({ page }) => {
  await page.goto('./')
  await page.getByText('© Vermouth NU CVR - 40649395 Følg os Ig Fb info@vermouth.nu').click()

  const pageTitle = await page.title()
  expect(pageTitle).toContain('Vermouth.NU')

  await page.locator('div').filter({ hasText: 'Hjem Forhandlere Produkter' }).nth(2).click()

  const thirdDiv = await page
    .locator('div')
    .filter({ hasText: 'Hjem Forhandlere Produkter' })
    .nth(2)

  const divText = await thirdDiv.textContent()
  expect(divText).toContain('Hjem Forhandlere Produkter')
  const logoImage = await page.locator('a[title="logo"] img[alt="logo"]').first()
  expect(logoImage).toBeTruthy()

  await page.locator('div').filter({ hasText: '➺ ➺' }).nth(2).click()

  const carouselImages = await page.locator('div:has(img)').all()
  expect(carouselImages.length).toBeGreaterThan(0)
})
