import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const productName = 'Forzudo Rojo'
const productPath = '/shop/forzudo-rojo'

async function addProductToCart(page: Page) {
  await page.goto(productPath, { waitUntil: 'domcontentloaded' })
  const quantity = await page.getByRole('spinbutton', { name: 'Antal', exact: true }).inputValue()
  await page.getByRole('button', { name: 'LÆG I KURV' }).click()
  await expect(page.getByRole('link', { name: /kurv 1/ })).toBeVisible()
  return quantity
}

async function fillCheckoutForm(page: Page) {
  await page.getByRole('textbox', { name: 'E-mailadresse' }).fill('kunde@example.com')
  await page.getByRole('textbox', { name: 'Fornavn' }).fill('Karla')
  await page.getByRole('textbox', { name: 'Efternavn' }).fill('Kunde')
  await page
    .getByRole('textbox', { name: 'Adresse', exact: true })
    .fill('Overgaden Neden Vandet 49B')
  await page.getByRole('textbox', { name: 'Postnummer' }).fill('1414')
  await page.getByRole('textbox', { name: 'By' }).fill('København')
  await page.getByRole('textbox', { name: 'Telefonnummer' }).fill('26353606')
  await page.getByRole('checkbox', { name: /Jeg accepterer handelsbetingelserne/ }).check()
}

test('customer can add and remove a product from the cart', async ({ page }) => {
  const quantity = await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  const productRow = page.locator('li').filter({ hasText: productName }).first()
  await expect(productRow).toBeVisible()
  await expect(productRow).toContainText('Flaske — 100 cl')
  await expect(productRow.getByRole('img', { name: 'Forzudo Rojo – Flaske, 100 cl' })).toBeVisible()
  await expect(productRow.locator('input[name="quantity"]')).toHaveValue(quantity)

  const selectedShippingMethod = page
    .getByRole('group', { name: 'Leveringsmetode', exact: true })
    .locator('label')
    .filter({ has: page.locator('input:checked') })
  const selectedShippingPrice = await selectedShippingMethod.locator('p').nth(1).innerText()
  const deliverySummaryPrice = page
    .locator('dl')
    .filter({ hasText: 'Subtotal' })
    .first()
    .locator('div')
    .filter({ hasText: 'Levering' })
    .locator('dd')

  await expect(deliverySummaryPrice).toHaveText(selectedShippingPrice)

  await productRow.getByRole('button', { name: `Fjern ${productName} fra kurv.` }).click()
  await expect(productRow).toBeHidden()
})

test('customer can apply a discount code in the cart summary', async ({ page }) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  const cartSummary = page.locator('[data-testid="cart-summary"]:visible')
  const discountCodeInput = cartSummary.getByRole('textbox', { name: 'Rabatkode' })
  const applyDiscountButton = cartSummary.getByRole('button', { name: 'Anvend' })
  const totals = cartSummary.getByTestId('cart-totals')
  const totalsBoxBeforeError = await totals.boundingBox()

  await discountCodeInput.fill('not-a-code')
  await applyDiscountButton.click()

  await expect(cartSummary.getByText('Rabatkoden kunne ikke anvendes.')).toBeVisible()

  const totalsBoxAfterError = await totals.boundingBox()
  expect(totalsBoxAfterError?.y).toBe(totalsBoxBeforeError?.y)

  await discountCodeInput.fill('test10')
  await applyDiscountButton.click()

  await expect(cartSummary.getByText('Rabatkoden er tilføjet.')).toBeVisible()
  await expect(totals.locator('div').filter({ hasText: 'Rabat' })).toBeVisible()
})

test('cart debounces quantity changes and unlocks controls after a failed update', async ({
  page,
}) => {
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'networkidle' })
  const row = page.locator('li.cart-item:visible').filter({ hasText: productName })
  const quantity = row.locator('input[name="quantity"]')
  const increase = row.getByRole('button', { name: 'Increase quantity' })
  const decrease = row.getByRole('button', { name: 'Decrease quantity' })
  await quantity.fill('3')
  const [refresh] = await Promise.all([
    page.waitForResponse((response) => response.url().includes('/kurv/__data.json')),
    quantity.press('Tab'),
  ])
  await refresh.finished()
  await expect(quantity).toBeEnabled()
  const initialQuantity = 3
  let requests = 0
  let submittedQuantity: string | null = null
  let releaseRequest!: () => void
  const heldRequest = new Promise<void>((resolve) => {
    releaseRequest = resolve
  })

  await page.route('**/kurv?/addOrUpdateItemQuantity', async (route) => {
    requests++
    const request = route.request()
    const body = new Request(request.url(), {
      method: 'POST',
      headers: { 'content-type': request.headers()['content-type'] },
      body: request.postDataBuffer(),
    })
    submittedQuantity = String((await body.formData()).get('quantity'))
    await heldRequest
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ type: 'failure', status: 400, data: null }),
    })
  })

  try {
    await increase.click()
    await increase.click()
    await increase.click()
    await expect(quantity).toHaveValue(String(initialQuantity + 3))
    await expect.poll(() => requests).toBe(1)
    expect(submittedQuantity).toBe(String(initialQuantity + 3))
    await expect(increase).toBeDisabled()
    await expect(decrease).toBeDisabled()
    await expect(quantity).toBeDisabled()
    const totals = page.locator('[data-testid="cart-summary"]:visible').getByTestId('cart-totals')
    await expect(totals.locator('div').filter({ hasText: 'Subtotal' })).toContainText(
      'DKK\u00a0819.00',
    )
    await expect(row.getByTestId('cart-unit-price').locator('li').first()).toHaveCSS(
      'font-weight',
      '700',
    )

    releaseRequest()
    await expect(increase).toBeEnabled()
    await expect(decrease).toBeEnabled()
    await expect(quantity).toBeEnabled()
    expect(requests).toBe(1)
    await expect(quantity).toHaveValue(String(initialQuantity))
    await expect(totals.locator('div').filter({ hasText: 'Subtotal' })).toContainText(
      'DKK\u00a0819.00',
    )

    await page.unroute('**/kurv?/addOrUpdateItemQuantity')
    await increase.click()
    await expect(increase).toBeDisabled()
    await expect(increase).toBeEnabled({ timeout: 15_000 })
    await page.reload({ waitUntil: 'networkidle' })
    await expect(quantity).toHaveValue(String(initialQuantity + 1))
  } finally {
    releaseRequest()
    await page.unroute('**/kurv?/addOrUpdateItemQuantity')
    await row.getByRole('button', { name: `Fjern ${productName} fra kurv.` }).click()
    await expect(row).toBeHidden()
  }
})

test('cart keeps consistent unit prices and three columns until narrow mobile', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'networkidle' })
  const row = page
    .locator('li.cart-item:visible')
    .filter({ hasText: productName })
    .filter({ hasText: 'Flaske — 100 cl' })
  const price = row.getByTestId('cart-unit-price')
  const quantity = row.locator('input[name="quantity"]')
  const summary = page.locator('[data-testid="cart-summary"]:visible')

  try {
    await expect(row.getByRole('list', { name: 'Mængdepriser' })).toContainText(
      'DKK\u00a0273.00/stk. v. min 3 SPAR 7%',
    )
    await expect(row.getByRole('list', { name: 'Mængdepriser' })).toContainText(
      'DKK\u00a0250.00/stk. v. min 6 SPAR 15%',
    )
    for (const [count, unitPrice, threshold, percent] of [
      [4, 273, 3, 7],
      [3, 273, 3, 7],
      [6, 250, 6, 15],
    ] as const) {
      await quantity.fill(String(count))
      const [refresh] = await Promise.all([
        page.waitForResponse((response) => response.url().includes('/kurv/__data.json')),
        quantity.press('Tab'),
      ])
      await refresh.finished()
      await expect(price).toContainText(
        `DKK\u00a0${unitPrice.toFixed(2)}/stk. v. min ${threshold} SPAR ${percent}%`,
      )
      await expect(price.locator('li').last().locator('s')).toContainText('DKK\u00a0295.00/stk.')
      await expect(price.locator('s')).toHaveCount(2)
      await expect(
        price
          .locator('li')
          .filter({ hasText: `v. min ${threshold} SPAR` })
          .locator('s'),
      ).toHaveCount(0)
    }

    for (const width of [540, 1184, 375, 319]) {
      await page.setViewportSize({ width, height: 968 })
      const image = await row
        .getByRole('img', { name: 'Forzudo Rojo – Flaske, 100 cl' })
        .boundingBox()
      const details = await row.locator('.cart-item-details').boundingBox()
      const controls = await quantity.boundingBox()
      expect(image).not.toBeNull()
      expect(details).not.toBeNull()
      expect(controls).not.toBeNull()
      expect(details!.x).toBeGreaterThanOrEqual(image!.x + image!.width)
      if (width <= 375) {
        expect(controls!.y).toBeGreaterThanOrEqual(details!.y + details!.height)
      } else {
        expect(controls!.x).toBeGreaterThanOrEqual(details!.x + details!.width)
        expect(controls!.y).toBeLessThan(details!.y + details!.height)
      }
    }

    await summary.getByRole('textbox', { name: 'Rabatkode' }).fill('test10')
    await summary.getByRole('button', { name: 'Anvend' }).click()
    await expect(summary.getByText('Rabatkoden er tilføjet.')).toBeVisible()
    await expect(summary.getByText(/Mængderabat/)).toHaveCount(0)
    await expect(
      summary
        .getByTestId('cart-totals')
        .locator('div')
        .filter({ hasText: /^I alt/ })
        .locator('dd'),
    ).toContainText('1,350.00')

    // A different size must not advertise the bottle's tiers.
    await page.goto('/shop/forzudo-rojo?variant=forzudo-rojo-3l-bag-in-box', {
      waitUntil: 'networkidle',
    })
    await page.getByRole('button', { name: 'LÆG I KURV', exact: true }).click()
    await expect(page.getByRole('link', { name: '2', exact: true })).toBeVisible()
    await page.goto('/kurv', { waitUntil: 'networkidle' })
    const boxRow = page.locator('li.cart-item:visible').filter({ hasText: 'Bag-in-Box — 3 L' })
    await expect(boxRow.getByRole('list', { name: 'Mængdepriser' })).toHaveCount(0)
    await expect(summary.getByText(/Mængderabat/)).toHaveCount(0)
    await boxRow.getByRole('button', { name: `Fjern ${productName} fra kurv.` }).click()
    await expect(boxRow).toHaveCount(0)

    await quantity.fill('2')
    await quantity.press('Tab')
    await expect(price).toContainText('DKK\u00a0295.00/stk.')
    await expect(price.locator('li').last().locator('s')).toHaveCount(0)
    await expect(price.locator('s')).toHaveCount(2)
    await expect(row.getByRole('list', { name: 'Mængdepriser' }).locator('li')).toHaveCount(3)
    for (const amount of await summary.getByTestId('cart-totals').locator('dd').all()) {
      await expect(amount).toHaveCSS('white-space', 'nowrap')
    }
    const fits = await row.evaluate((node) => node.scrollWidth <= node.clientWidth)
    expect(fits).toBe(true)
  } finally {
    await page.goto('/kurv', { waitUntil: 'networkidle' })
    const remainingRows = page.locator('li.cart-item:visible').filter({ hasText: productName })
    while (await remainingRows.count()) {
      const count = await remainingRows.count()
      await remainingRows
        .first()
        .getByRole('button', { name: `Fjern ${productName} fra kurv.` })
        .click()
      await expect(remainingRows).toHaveCount(count - 1)
    }
  }
})

test('customer can continue from cart to payment', async ({ page }, testInfo) => {
  test.skip(
    !testInfo.config.metadata.ci,
    'Temporarily CI-only: ePay rejects localhost return URLs with explicit ports.',
  )

  await addProductToCart(page)
  await page.goto('/kurv', { waitUntil: 'domcontentloaded' })

  await expect(page.getByText(productName).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kontaktinformation' })).toBeVisible()

  await fillCheckoutForm(page)
  await page.getByRole('button', { name: 'Gå til betaling' }).click()

  await expect(page).toHaveURL(/payments\.epay\.eu/, { timeout: 15_000 })
  await expect(page.getByText('Secure payment by')).toBeVisible()
})
