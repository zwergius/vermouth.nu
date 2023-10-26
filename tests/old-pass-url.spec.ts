import { test, expect } from '@playwright/test'

test('old pass url should redirect new pass url', async ({ page }) => {
  await page.goto('/christian-vermouth-nu.pkpass', { waitUntil: 'load' })
  await page.waitForURL('/cards/christian', { timeout: 30000 })

  const currentURL = page.url()

  expect(currentURL).toContain('/cards/christian')
})
