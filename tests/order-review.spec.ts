import { expect, test } from '@playwright/test'

declare const process: {
  env: Record<string, string | undefined>
}

const orderId = process.env.PLAYWRIGHT_ORDER_REVIEW_ORDER_ID ?? 'order_01KRQRKPPW39N3939K59R9K2MM'
const expectedProductTitle = process.env.PLAYWRIGHT_ORDER_REVIEW_PRODUCT_TITLE ?? 'Sardino Rojo'

test.describe('order product review page', () => {
  test('customer can open the Danish order summary URL', async ({ page }) => {
    await page.goto(`/ordrer/${orderId}`, { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(new RegExp(`/ordrer/${orderId}$`))
    await expect(page.getByRole('heading', { name: 'TAK for din handel!' })).toBeVisible()
    await expect(page.getByText(`Ordrenummer #`)).toBeVisible()
  })

  test('English order URL redirects to the Danish order summary URL', async ({ page }) => {
    await page.goto(`/orders/${orderId}`, { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(new RegExp(`/ordrer/${orderId}$`))
    await expect(page.getByRole('heading', { name: 'TAK for din handel!' })).toBeVisible()
  })

  test('customer can open product review forms from an order link', async ({ page }) => {
    await page.goto(`/ordrer/${orderId}/anmeld`, { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { name: 'Anmeld dine produkter' })).toBeVisible()
    await expect(page.getByText(`Ordre #`)).toBeVisible()

    if (expectedProductTitle) {
      await expect(page.getByRole('heading', { name: expectedProductTitle })).toBeVisible()
    }

    const firstReviewForm = page.locator('form').first()
    await expect(firstReviewForm.getByRole('group', { name: 'Din vurdering' })).toBeVisible()
    await expect(firstReviewForm.getByLabel('Navn')).toBeVisible()
    await expect(firstReviewForm.getByLabel('Din anmeldelse')).toBeVisible()
    await expect(firstReviewForm.getByLabel('Email')).toHaveCount(0)
    await expect(firstReviewForm.getByRole('button', { name: 'SEND ANMELDELSE' })).toBeVisible()
  })
})
