import { expect, test } from './fixtures'

test.use({ locale: 'da-DK' })

test('ordinary Forzudo tiers preview total quantities and stay isolated by size', async ({
  page,
}) => {
  // Offer selection is client-side; wait for initialization before interacting.
  await page.goto('/shop/forzudo-rojo', { waitUntil: 'networkidle' })
  const cartPosts: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/kurv?')) {
      cartPosts.push(request.url())
    }
  })
  const choices = page
    .getByRole('list', { name: 'Priser efter antal' })
    .filter({ has: page.locator('button') })
  const total = page.getByTestId('quantity-total')
  const quantity = page.getByRole('spinbutton', { name: 'Antal', exact: true })
  await expect(choices).toBeVisible()
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)
  await expect(choices.getByRole('button', { name: /^Køb 1 for/ })).toHaveCount(0)
  await choices.getByRole('button', { name: 'Køb 3 for 273,00 DKK/stk' }).click()
  await expect(quantity).toHaveValue('3')
  expect(cartPosts).toEqual([])
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

  expect(cartPosts).toEqual([])

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

test('grid advertises the cheapest volume unit price at mobile and desktop widths', async ({
  page,
}) => {
  await page.goto('/shop')
  const card = page
    .locator('li.grid-item')
    .filter({ has: page.locator('a[href*="forzudo-rojo-100cl-bottle"]') })
  const price = card.getByTestId('grid-price')
  await expect(price).toContainText(/250,00\s*DKK/)
  await expect(price.locator('s')).toContainText(/295,00\s*DKK/)
  await expect(price).toContainText('Stykpris v/ 6 stk.')
  await expect(price).not.toContainText(/819,00|1\.500,00/)
  const savings = card.getByLabel('Spar op til 15%', { exact: true })
  await expect(savings).toContainText(/SPAR\s*op til/)
  await expect(savings).toContainText('15%')
  const bubbleSizes: number[] = []
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const fits = await price.evaluate((node) => {
      const bounds = node.closest('li.grid-item')!.getBoundingClientRect()
      return [...node.querySelectorAll('p, span, s')].every((el) => {
        const rect = el.getBoundingClientRect()
        return (
          rect.left >= bounds.left && rect.right <= bounds.right && rect.bottom <= bounds.bottom
        )
      })
    })
    expect(fits, `price fits at ${width}px`).toBe(true)
    const layout = await price.evaluate((node) => {
      const card = node.closest('li.grid-item')!.getBoundingClientRect()
      const current = node.querySelector('p')!.getBoundingClientRect()
      const caption = node.querySelector('p:last-child')!.getBoundingClientRect()
      return {
        offset: Math.abs((current.left + current.right - card.left - card.right) / 2),
        inline: caption.top < current.bottom && caption.bottom > current.top,
      }
    })
    expect(layout.offset, `current price is centered at ${width}px`).toBeLessThanOrEqual(1)
    expect(layout.inline, `caption stays inline at ${width}px`).toBe(true)
    bubbleSizes.push(
      await savings.evaluate(
        (node) => node.querySelector<HTMLElement>('.discount-badge')!.offsetWidth,
      ),
    )
  }
  expect(new Set(bubbleSizes).size, 'bubble scales with the card width').toBeGreaterThan(1)
})

for (const prices of [
  undefined,
  [{ amount: 100, min_quantity: 3, currency_code: 'dkk', rules_count: 1 }],
]) {
  test(`keeps a labelled unit price when tier data is ${prices ? 'rejected' : 'missing'}`, async ({
    page,
  }) => {
    await page.goto('/shop')
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
    await page.getByRole('spinbutton', { name: 'Antal', exact: true }).fill('2')
    await expect(total).toContainText(/800,00\s*DKK/)
    await expect(total).toContainText('pr. stk.')
    await expect(total).not.toContainText(/1\.600/)
  })
}

test('Bag-in-Box quantity tiers use a neutral quantity label', async ({ page }) => {
  await page.goto('/shop')
  await page.route('**/store/products?**', async (route) => {
    const response = await route.fetch()
    const body = await response.json()
    for (const product of body.products) {
      for (const variant of product.variants) {
        if (variant.sku === 'forzudo-rojo-3l-bag-in-box') {
          variant.prices.push({
            amount: 700,
            min_quantity: 3,
            currency_code: 'dkk',
            rules_count: 0,
          })
        }
      }
    }
    await route.fulfill({ json: body })
  })
  await page.locator('a[href*="forzudo-rojo-3l-bag-in-box"]').first().click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Køb 3 for 700,00 DKK/stk' }).click()
  await expect(page.getByRole('spinbutton', { name: 'Antal', exact: true })).toHaveValue('3')
  await expect(page.getByTestId('quantity-total')).toContainText(/2\.100,00\s*DKK/)
})
