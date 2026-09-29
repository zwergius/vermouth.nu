import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

test.use({ locale: 'da-DK' })

// Exercise ordinary tier pricing independently of staging's active override Price List.
async function openOrdinaryTiers(page: Page, productDetails = false) {
  await page.goto('/sortiment')
  await page.route('**/store/products?**', async (route) => {
    const url = new URL(route.request().url())
    if (url.searchParams.has('collection_id')) {
      url.searchParams.delete('collection_id')
      url.searchParams.set('handle', 'forzudo-rojo')
    }
    const response = await route.fetch({ url: url.toString() })
    const body = await response.json()
    for (const product of body.products) {
      for (const variant of product.variants) {
        if (variant.sku !== 'forzudo-rojo-100cl-bottle') continue
        const price = variant.calculated_price
        price.is_calculated_price_price_list = false
        price.is_original_price_price_list = false
        for (const details of [price.calculated_price, price.original_price]) {
          details.price_list_id = null
          details.price_list_type = null
        }
      }
    }
    await route.fulfill({ json: body })
  })
  await page
    .locator('header a')
    .filter({ has: page.getByAltText('Vermouth.nu', { exact: true }) })
    .click()
  if (productDetails) await page.locator('a[href*="forzudo-rojo-100cl-bottle"]').first().click()
}

test('ordinary Forzudo tiers preview total quantities and stay isolated by size', async ({
  page,
}) => {
  await openOrdinaryTiers(page, true)
  const choices = page
    .getByRole('list', { name: 'Priser efter antal' })
    .filter({ has: page.locator('button') })
  const total = page.getByTestId('quantity-total')
  const quantity = page.getByRole('spinbutton', { name: 'Antal flasker' })
  await expect(choices).toBeVisible()
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)
  await expect(choices.getByRole('button', { name: /^Køb 1 for/ })).toHaveCount(0)
  await choices.getByRole('button', { name: 'Køb 3 for 273,00 DKK/stk' }).click()
  await expect(quantity).toHaveValue('3')
  await expect(total).toContainText(/819,00\s*DKK/)
  await expect(total.locator('s')).toContainText(/885,00\s*DKK/)
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 7%')
  await quantity.fill('4')
  await expect(total).toContainText(/1\.092,00\s*DKK/)
  await choices.getByRole('button', { name: 'Køb 6 for 250,00 DKK/stk' }).click()
  await expect(quantity).toHaveValue('6')
  await expect(total.locator('s')).toContainText(/1\.770,00\s*DKK/)
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 15%')
  await quantity.fill('2')
  await expect(total).toContainText(/590,00\s*DKK/)
  await expect(total.locator('s')).toHaveCount(0)
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)

  // Choosing an offer must not submit; validate the explicit action payload without mutating Medusa.
  await choices.getByRole('button', { name: /Køb 6 for/ }).click()
  let submittedQuantity: string | null = null
  await page.route('**/kurv?**', async (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    const form = await new Response(route.request().postDataBuffer(), {
      headers: { 'content-type': route.request().headers()['content-type'] },
    }).formData()
    submittedQuantity = String(form.get('quantity'))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        type: 'failure',
        status: 400,
        data: '[{"message":1},"Test submission intercepted"]',
      }),
    })
  })
  await page.getByRole('button', { name: 'LÆG I KURV', exact: true }).click()
  await expect.poll(() => submittedQuantity).toBe('6')

  await page.getByRole('radio', { name: /Bag-in-Box/ }).check()
  await expect(total).toContainText(/750,00\s*DKK/)
  await expect(choices).toHaveCount(0)
  await expect(quantity).toHaveValue('1')
  await page.getByRole('radio', { name: /Flaske/ }).check()
  await expect(quantity).toHaveValue('1')
  await expect(total).toContainText(/295,00\s*DKK/)
})

test('quantity totals fit product cards at mobile and desktop widths', async ({ page }) => {
  await openOrdinaryTiers(page)
  const card = page
    .locator('li.grid-item')
    .filter({ has: page.locator('a[href*="forzudo-rojo-100cl-bottle"]') })
  const offers = card.getByRole('list', { name: 'Priser efter antal' })
  await expect(offers).toContainText(/819,00\s*DKK/)
  await expect(offers).toContainText(/1\.500,00\s*DKK/)
  await expect(offers.locator('li').first().locator('s')).toHaveCount(0)
  await expect(offers.locator('s')).toHaveCount(2)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const fits = await card.evaluate((node) => {
      const bounds = node.getBoundingClientRect()
      return [...node.querySelectorAll('.quantity-offers li')].every((el) => {
        const rect = el.getBoundingClientRect()
        return (
          rect.left >= bounds.left && rect.right <= bounds.right && rect.bottom <= bounds.bottom
        )
      })
    })
    expect(fits, `offers fit at ${width}px`).toBe(true)
    const rowTops = await offers
      .locator('li')
      .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)))
    expect(new Set(rowTops).size, `tiers stay on one row at ${width}px`).toBe(1)
  }
})

for (const prices of [
  undefined,
  [{ amount: 100, min_quantity: 3, currency_code: 'dkk', rules_count: 1 }],
]) {
  test(`keeps a labelled unit price when tier data is ${prices ? 'rejected' : 'missing'}`, async ({
    page,
  }) => {
    await page.goto('/sortiment')
    await page.route('**/store/products?**', async (route) => {
      const response = await route.fetch()
      const body = await response.json()
      for (const product of body.products) {
        for (const variant of product.variants) {
          variant.calculated_price = {
            calculated_amount: 800,
            original_amount: 800,
            currency_code: 'dkk',
            is_calculated_price_tax_inclusive: true,
          }
          variant.prices = prices
        }
      }
      await route.fulfill({ json: body })
    })
    await page.locator('a[href*="forzudo-rojo-100cl-bottle"]').first().click()
    const total = page.getByTestId('quantity-total')
    await expect(total).toContainText(/800,00\s*DKK/)
    await page.getByRole('spinbutton', { name: 'Antal flasker' }).fill('2')
    await expect(total).toContainText(/800,00\s*DKK/)
    await expect(total).toContainText('pr. stk.')
    await expect(total).not.toContainText(/1\.600/)
  })
}
