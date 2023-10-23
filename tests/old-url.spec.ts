import { test, expect } from '@playwright/test'

test('test old url', async ({ page }) => {
  await page.goto('./christian-vermouth-nu.pkpass')
  await page.waitForTimeout(2000)
  const userAgent = await page.evaluate(() => navigator.userAgent)
  const currentURL = page.url()
  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    expect(currentURL).toBe('https://www.vermouth.nu/cards/christian')
  }

  if (userAgent.includes('safari')) {
    expect(currentURL).toBe('https://wwww.vermouth.nu/christian.pkpass')
  }
})
