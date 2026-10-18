import { expect, test } from './fixtures'

test.use({ locale: 'da-DK' })

test('ordinary Forzudo offers show unit prices and preserve quantity form actions', async ({
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
  const choices = page.getByRole('group', { name: 'Priser efter antal' })
  const total = page.getByTestId('quantity-total')
  const quantity = page.getByRole('spinbutton', { name: 'Antal', exact: true })
  await expect(choices).toBeVisible()
  const three = choices.locator('label').filter({ hasText: '3 Flasker' })
  const six = choices.locator('label').filter({ hasText: '6 Flasker' })
  await expect(three).toContainText(/273,00\s*DKK\/stk\./)
  await expect(three).toContainText(/samlet pris 819,00\s*DKK/)
  await expect(three).toContainText('Mest Populære')
  await expect(three).toContainText('Min 3 Flasker')
  await expect(three).toContainText('Spar 7%')
  await expect(six).toContainText('Bedste Pris')
  await expect(six).toContainText(/samlet pris 1\.500,00\s*DKK/)
  await expect(six).toContainText('Spar 15%')
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)
  await expect(choices.getByRole('radio', { name: /^1 Flaske/ })).toHaveCount(0)
  await choices.getByRole('radio', { name: /3 Flasker/ }).check()
  await expect(quantity).toHaveValue('3')
  expect(cartPosts).toEqual([])
  await expect(total).toContainText(/273,00\s*DKK\/stk\./)
  await expect(total.locator('s')).toContainText(/295,00\s*DKK/)
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 7%')
  await quantity.fill('4')
  await expect(total).toContainText(/273,00\s*DKK\/stk\./)
  await choices.getByRole('radio', { name: /6 Flasker/ }).check()
  await expect(quantity).toHaveValue('6')
  await expect(total.locator('s')).toContainText(/295,00\s*DKK/)
  await expect(page.getByTestId('quantity-savings')).toHaveText('Spar 15%')
  await quantity.fill('2')
  await expect(total).toContainText(/295,00\s*DKK\/stk\./)
  await expect(total.locator('s')).toHaveCount(0)
  await expect(page.getByTestId('quantity-savings')).toHaveCount(0)

  expect(cartPosts).toEqual([])

  // Choosing an offer must not submit; validate the explicit action payload without mutating Medusa.
  await choices.getByRole('radio', { name: /6 Flasker/ }).check()
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
  await page
    .getByRole('group', { name: 'Vælg format' })
    .getByRole('radio', { name: /Flaske/ })
    .check()
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
    await expect(total).toContainText('DKK/stk.')
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
  await page
    .getByRole('group', { name: 'Priser efter antal' })
    .getByRole('radio', { name: /3 stk/ })
    .check()
  await expect(page.getByRole('spinbutton', { name: 'Antal', exact: true })).toHaveValue('3')
  await expect(page.getByTestId('quantity-total')).toContainText(/700,00\s*DKK\/stk\./)
})

test('offer badges follow unit-price ranking and radio keys select minimum quantities', async ({
  page,
}) => {
  await page.goto('/shop')
  await page.route('**/store/products?**', async (route) => {
    const response = await route.fetch()
    const body = await response.json()
    for (const product of body.products) {
      for (const variant of product.variants) {
        if (variant.sku === 'forzudo-rojo-100cl-bottle') {
          variant.prices = [
            { amount: 295, currency_code: 'dkk', rules_count: 0 },
            { amount: 190, min_quantity: 3, max_quantity: 5, currency_code: 'dkk', rules_count: 0 },
            { amount: 220, min_quantity: 6, max_quantity: 8, currency_code: 'dkk', rules_count: 0 },
            { amount: 180, min_quantity: 9, currency_code: 'dkk', rules_count: 0 },
          ]
        }
      }
    }
    await route.fulfill({ json: body })
  })
  await page.locator('a[href*="forzudo-rojo-100cl-bottle"]').first().click()
  await page.waitForLoadState('networkidle')
  const offers = page.getByRole('group', { name: 'Priser efter antal' })
  const three = offers.locator('label').filter({ hasText: '3 Flasker' })
  const six = offers.locator('label').filter({ hasText: '6 Flasker' })
  const nine = offers.locator('label').filter({ hasText: '9 Flasker' })
  await expect(three).toContainText('Mest Populære')
  await expect(three).toContainText('Min 3 Flasker')
  await expect(six).not.toContainText(/Bedste Pris|Mest Populære/)
  await expect(nine).toContainText('Bedste Pris')
  await expect(nine).toContainText(/samlet pris 1\.620,00 DKK/)
  await three.getByRole('radio').check()
  await three.getByRole('radio').press('ArrowRight')
  await expect(page.getByRole('spinbutton', { name: 'Antal', exact: true })).toHaveValue('6')
  await expect(page.getByTestId('quantity-total')).toContainText('220,00 DKK/stk.')
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const fits = await offers.evaluate((node) =>
      [...node.querySelectorAll('label p, label span')].every((el) => {
        const rect = el.getBoundingClientRect()
        return (
          rect.left >= 0 &&
          rect.right <= document.documentElement.clientWidth &&
          el.scrollWidth <= el.clientWidth
        )
      }),
    )
    expect(fits, `offer text fits at ${width}px`).toBe(true)
    const rows = await offers.evaluate((node) => {
      const group = node.getBoundingClientRect()
      return [...node.querySelectorAll('label')].map((label) => {
        const bounds = label.getBoundingClientRect()
        return { width: bounds.width, groupWidth: group.width }
      })
    })
    for (const row of rows) {
      expect(row.width, `offer fills width at ${width}px`).toBeGreaterThanOrEqual(
        row.groupWidth - 2,
      )
    }
  }
})

test('free shipping uses each offer minimum total rather than the entered quantity', async ({
  page,
}) => {
  await page.goto('/shop')
  await page.route('**/store/products?**', async (route) => {
    const response = await route.fetch()
    const body = await response.json()
    for (const product of body.products) {
      for (const variant of product.variants) {
        if (variant.sku === 'forzudo-rojo-100cl-bottle') {
          variant.prices = [
            { amount: 295, currency_code: 'dkk', rules_count: 0 },
            {
              amount: 182.99,
              min_quantity: 3,
              max_quantity: 4,
              currency_code: 'dkk',
              rules_count: 0,
            },
            { amount: 109.8, min_quantity: 5, currency_code: 'dkk', rules_count: 0 },
          ]
        }
      }
    }
    await route.fulfill({ json: body })
  })
  await page.locator('a[href*="forzudo-rojo-100cl-bottle"]').first().click()
  await page.waitForLoadState('networkidle')
  const offers = page.getByRole('group', { name: 'Priser efter antal' })
  const three = offers.locator('label').filter({ hasText: '3 Flasker' })
  const five = offers.locator('label').filter({ hasText: '5 Flasker' })
  await expect(three).toContainText('samlet pris 548,97 DKK')
  await expect(three).not.toContainText('Fri Fragt')
  await expect(five).toContainText('samlet pris 549,00 DKK')
  await expect(five).toContainText('Fri Fragt')
  await page.getByRole('spinbutton', { name: 'Antal', exact: true }).fill('10')
  await expect(three).not.toContainText('Fri Fragt')
  await expect(five).toContainText('samlet pris 549,00 DKK')
})
