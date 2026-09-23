import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// The venue's local clock times must remain unchanged for visitors abroad.
test.use({ timezoneId: 'America/Los_Angeles' })

async function visitTastings(page: Page, empty = false) {
  // SvelteKit page-data response, kept independent of live event edits and the server clock.
  await page.route('**/smagninger/__data.json*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        type: 'data',
        nodes: [
          null,
          {
            type: 'data',
            uses: {},
            data: empty
              ? [{ tastings: 1 }, []]
              : [
                  { tastings: 1 },
                  [2, 6],
                  { id: 3, start_time: 4, end_time: 5 },
                  'november',
                  '2026-11-18T20:00:00',
                  '2026-11-18T22:00:00',
                  { id: 7, start_time: 8, end_time: 9 },
                  'january',
                  '2027-01-27T20:00:00',
                  '2027-01-27T22:00:00',
                ],
          },
        ],
      }),
    }),
  )
  await page.goto('/om-os')
  await page.locator('nav').getByRole('link', { name: 'smagninger', exact: true }).click()
  await expect(page).toHaveURL(/\/smagninger$/)
}

test('shows server-provided dates and the venue link', async ({ page }) => {
  await visitTastings(page)
  await expect(page.getByText('18.11.2026', { exact: true })).toBeVisible()
  await expect(page.getByText('27.01.2027', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Bunker526', exact: true })).toHaveAttribute(
    'href',
    'https://www.bunker526.nu',
  )
  await expect(page.getByText('kl. 20.00–22.00', { exact: false })).toHaveCount(2)
})

test('hides the dates block when the server returns no upcoming tastings', async ({ page }) => {
  await visitTastings(page, true)
  await expect(page.getByText('Kommende smagninger', { exact: false })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'BOOK NU', exact: true })).toBeVisible()
})
