import { expect, test } from '@playwright/test'

test.use({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
})

test('old pass URL redirects to the wallet card page', async ({ page }) => {
  await page.goto('/christian-vermouth-nu.pkpass', { waitUntil: 'domcontentloaded' })

  await expect(page).toHaveURL(/\/cards\/christian$/)
  await expect(page.locator('.container a')).toHaveCount(2)
})

test('wallet card page exposes iOS and Google wallet links', async ({ page }) => {
  await page.goto('/cards/christian', { waitUntil: 'domcontentloaded' })

  const links = page.locator('.container a')
  await expect(links).toHaveCount(2)
  await expect(links.nth(0)).toHaveAttribute('href', /christian\.pkpass$/)
  await expect(links.nth(1)).toHaveAttribute('href', /^https:\/\/pay\.google\.com\/gp\/v\/save/)
})
