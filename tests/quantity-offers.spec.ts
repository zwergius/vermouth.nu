import { expect, test } from './fixtures'

declare const process: { env: Record<string, string | undefined> }

test.use({ locale: 'da-DK' })

test('verified Forzudo tiers preview total quantities and stay isolated by size', async ({
  page,
}) => {
  test.skip(
    !process.env.QUANTITY_OFFER_VARIANT_IDS,
    'Requires the verified test variant enabled on the server',
  )
  await page.goto('/sortiment/forzudo-rojo')
  const choices = page
    .getByRole('list', { name: 'Priser efter antal' })
    .filter({ has: page.locator('button') })
  const total = page.getByTestId('quantity-total')
  const quantity = page.getByRole('spinbutton', { name: 'Antal flasker' })
  await expect(choices).toBeVisible()
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)
  await expect(choices.getByRole('button', { name: /^Køb 1 for/ })).toHaveCount(0)
  await choices.getByRole('button', { name: 'Køb 3 for DKK 273,00/stk' }).click()
  await expect(quantity).toHaveValue('3')
  await expect(total).toContainText('DKK 819,00')
  await expect(total.locator('s')).toContainText('DKK 885,00')
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 7%')
  await quantity.fill('4')
  await expect(total).toContainText('DKK 1.092,00')
  await choices.getByRole('button', { name: 'Køb 6 for DKK 250,00/stk' }).click()
  await expect(quantity).toHaveValue('6')
  await expect(total.locator('s')).toContainText('DKK 1.770,00')
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 15%')
  await quantity.fill('2')
  await expect(total).toContainText('DKK 590,00')
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
  await expect(total).toHaveCount(0)
  await expect(choices).toHaveCount(0)
  await expect(quantity).toHaveValue('1')
  await page.getByRole('radio', { name: /Flaske/ }).check()
  await expect(quantity).toHaveValue('1')
  await expect(total).toContainText('DKK 295,00')
})

test('quantity totals fit product cards at mobile and desktop widths', async ({ page }) => {
  test.skip(
    !process.env.QUANTITY_OFFER_VARIANT_IDS,
    'Requires the verified test variant enabled on the server',
  )
  await page.goto('/sortiment')
  const card = page
    .locator('li.grid-item')
    .filter({ has: page.locator('a[href*="forzudo-rojo-100cl-bottle"]') })
  const offers = card.getByRole('list', { name: 'Priser efter antal' })
  await expect(offers).toContainText('DKK 819,00')
  await expect(offers).toContainText('DKK 1.500,00')
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
