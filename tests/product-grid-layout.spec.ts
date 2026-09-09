import { expect, test } from './fixtures'

for (const path of ['/', '/sortiment', '/sortiment/sardino-rojo']) {
  test(`${path} keeps product prices inside responsive cards`, async ({ page }) => {
    if (path === '/') {
      await page.goto('/sortiment')
      await page.route('**/store/products?**', (route) =>
        route.fulfill({
          json: {
            products: [
              {
                id: 'product-grid-layout',
                handle: 'sardino-rojo',
                title: 'Sardino Rojo',
                subtitle: 'Sømandens foretrukne',
                variants: [
                  {
                    id: 'layout-bottle',
                    sku: 'sardino-rojo-75cl-bottle',
                    variant_rank: 0,
                    title: 'Flaske',
                    options: [{ value: '75 cl', option: { title: 'Size' } }],
                    calculated_price: { calculated_amount: 195, original_amount: 250 },
                  },
                  {
                    id: 'layout-box',
                    sku: 'sardino-rojo-5l-bag-in-box',
                    variant_rank: 1,
                    title: 'Bag-in-Box',
                    options: [{ value: '5 L', option: { title: 'Size' } }],
                    calculated_price: { calculated_amount: 800, original_amount: 800 },
                  },
                ],
              },
            ],
          },
        }),
      )
      await page
        .locator('header a')
        .filter({ has: page.getByAltText('Vermouth.nu', { exact: true }) })
        .click()
    } else {
      await page.goto(path)
    }
    const cards = page.locator('li.grid-item').filter({ has: page.locator('a > h3') })
    await expect(cards.first()).toBeVisible()
    await expect(cards.first().locator('a > div:last-child > p:last-child')).toContainText(/kr|DKK/)
    if (path === '/') {
      await expect(cards).toHaveCount(2)
      await expect(cards.first()).toContainText('Normalpris')
      await expect(cards.last()).not.toContainText('Normalpris')
    }
    await page.evaluate(() => document.fonts.ready)

    for (const width of [390, 768, 1023, 1024, 1100, 1280, 1440, 1500, 1536, 1800]) {
      await page.setViewportSize({ width, height: 1000 })
      const overflow = await cards.evaluateAll((items) =>
        items.flatMap((card) => {
          const bounds = card.getBoundingClientRect()
          const details = card.querySelector('a > div:last-child')!
          const rect = details.getBoundingClientRect()
          const image = card.querySelector('img')!.getBoundingClientRect()
          const origin = card.querySelector('a > p')!.getBoundingClientRect()
          return rect.bottom > bounds.bottom + 1 ||
            rect.right > bounds.right + 1 ||
            rect.left < bounds.left - 1 ||
            image.height <= 0 ||
            image.top < origin.bottom - 1 ||
            image.bottom > rect.top + 1
            ? [
                {
                  product: card.querySelector('h3')?.textContent,
                  overflow: rect.bottom - bounds.bottom,
                },
              ]
            : []
        }),
      )
      expect(overflow, `${path} at ${width}px`).toEqual([])
    }
  })
}
