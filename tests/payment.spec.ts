import { expect, test } from '@playwright/test'

test('payment success page redirects to payment error without a cart', async ({ page }) => {
  await page.goto('/betaling/success', { waitUntil: 'domcontentloaded' })

  await expect(page).toHaveURL(/\/betaling\/fejl$/)
  await expect(page.getByText('Vi kunne ikke gennemføre betalingen.')).toBeVisible()
})

test('payment error page links customers back to payment', async ({ page }) => {
  await page.goto('/betaling/fejl', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { name: 'Hovsa!' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Prøv igen' })).toHaveAttribute('href', '/betaling')
})
