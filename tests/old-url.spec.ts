import { test, expect } from '@playwright/test'

test('test old url', async ({ page }) => {
  await page.goto('/christian-vermouth-nu.pkpass')
  await page.waitForTimeout(2000)
  const userAgent = await page.evaluate(() => navigator.userAgent)
  const currentURL = page.url()

  if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) {
    expect(currentURL).toContain('/cards/christian')
  }
  if (userAgent.includes('Android')) {
    const page1Promise = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'add the card to your wallet for android' }).click()
    const page1 = await page1Promise

    expect(page1).not.toBeNull()
  }

  if (userAgent.includes('safari')) {
    expect(currentURL).toBe('/christian.pkpass')
  }
})
