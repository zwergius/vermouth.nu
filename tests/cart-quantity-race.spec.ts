import { expect, test } from './fixtures'

test('an item refresh preserves another item’s debounced quantity edit', async ({ page }) => {
  test.setTimeout(60_000)
  for (const [variant, count] of [
    ['forzudo-rojo-100cl-bottle', 1],
    ['forzudo-rojo-3l-bag-in-box', 2],
  ] as const) {
    await page.goto(`/shop/forzudo-rojo?variant=${variant}`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'LÆG I KURV', exact: true }).click()
    await expect(page.getByRole('link', { name: new RegExp(`kurv ${count}`) })).toBeVisible()
  }
  await page.goto('/kurv', { waitUntil: 'networkidle' })
  const bottle = page.locator('li.cart-item:visible').filter({ hasText: 'Flaske — 100 cl' })
  const box = page.locator('li.cart-item:visible').filter({ hasText: 'Bag-in-Box — 3 L' })
  const bottleQuantity = bottle.locator('input[name="quantity"]')
  const boxQuantity = box.locator('input[name="quantity"]')
  const bottleId = await bottle
    .locator('form[action*="addOrUpdateItemQuantity"] input[name="cart_item_id"]')
    .inputValue()
  const boxId = await box
    .locator('form[action*="addOrUpdateItemQuantity"] input[name="cart_item_id"]')
    .inputValue()
  const nextBottle = Number(await bottleQuantity.inputValue()) + 1
  const nextBox = Number(await boxQuantity.inputValue()) + 1
  const submitted = new Map<string, number>()
  let releaseBottle!: () => void
  const heldResponse = new Promise<void>((resolve) => {
    releaseBottle = resolve
  })
  let bottleUpdated!: () => void
  const serverUpdated = new Promise<void>((resolve) => {
    bottleUpdated = resolve
  })

  await page.route('**/kurv?/addOrUpdateItemQuantity', async (route) => {
    const request = route.request()
    const body = new Request(request.url(), {
      method: 'POST',
      headers: { 'content-type': request.headers()['content-type'] },
      body: request.postDataBuffer(),
    })
    const form = await body.formData()
    const itemId = String(form.get('cart_item_id'))
    submitted.set(itemId, Number(form.get('quantity')))
    if (itemId !== bottleId) return route.continue()
    const response = await route.fetch()
    bottleUpdated()
    await heldResponse
    await route.fulfill({ response })
  })

  try {
    const now = new Date()
    await page.clock.install({ time: now })
    await page.clock.pauseAt(new Date(now.getTime() + 1000))
    await bottleQuantity.fill(String(nextBottle))
    await bottleQuantity.press('Tab')
    await page.clock.runFor(300)
    await serverUpdated
    await expect(bottleQuantity).toBeDisabled()

    await boxQuantity.fill(String(nextBox))
    await boxQuantity.press('Tab')
    releaseBottle()
    await expect(bottleQuantity).toBeEnabled()
    // B's debounce is paused while A's response refreshes the whole cart.
    await expect(boxQuantity).toHaveValue(String(nextBox))
    await expect(page.getByRole('button', { name: 'Gå til betaling' })).toBeDisabled()
    await page.clock.runFor(300)
    await expect.poll(() => submitted.get(boxId)).toBe(nextBox)
    await expect(boxQuantity).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Gå til betaling' })).toBeEnabled()
    await page.clock.resume()
    await page.reload({ waitUntil: 'networkidle' })
    await expect(bottleQuantity).toHaveValue(String(nextBottle))
    await expect(boxQuantity).toHaveValue(String(nextBox))
  } finally {
    releaseBottle()
    await page.unroute('**/kurv?/addOrUpdateItemQuantity')
    await page.clock.resume()
    await page.goto('/kurv', { waitUntil: 'networkidle' })
    const rows = page.locator('li.cart-item:visible').filter({ hasText: 'Forzudo Rojo' })
    while (await rows.count()) {
      const count = await rows.count()
      await rows.first().getByRole('button', { name: 'Fjern Forzudo Rojo fra kurv.' }).click()
      await expect(rows).toHaveCount(count - 1)
    }
  }
})
