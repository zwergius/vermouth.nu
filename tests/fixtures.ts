import { expect, test as base } from '@playwright/test'

export { expect }

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://static.klaviyo.com/**', (route) => route.abort())
    await use(page)
  },
})
