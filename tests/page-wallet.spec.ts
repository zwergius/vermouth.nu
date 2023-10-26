import { test, expect } from '@playwright/test'

test('page-wallet shows that there should be two links', async ({ page }) => {
  await page.goto('/cards/christian')
  await page.waitForLoadState('load')
  const container = await page.locator('.wrapper > .container')
  const linksInsideContainer = await container.locator('a')
  expect(await linksInsideContainer.count()).toBe(2)
})
