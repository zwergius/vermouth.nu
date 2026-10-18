import { expect, test } from './fixtures'

for (const path of ['/', '/shop', '/shop/sardino-rojo']) {
  test(`${path} keeps product prices inside responsive cards`, async ({ page }) => {
    if (path === '/') {
      await page.goto('/shop')
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
                    calculated_price: {
                      calculated_amount: 195,
                      original_amount: 250,
                      currency_code: 'dkk',
                      is_calculated_price_tax_inclusive: true,
                    },
                    prices: Array.from({ length: 8 }, (_, index) => ({
                      amount: index === 7 ? 180 : 180 - index * 10,
                      min_quantity: (index + 1) * 3,
                      currency_code: 'dkk',
                      rules_count: 0,
                    })),
                  },
                  {
                    id: 'layout-box',
                    sku: 'sardino-rojo-5l-bag-in-box',
                    variant_rank: 1,
                    title: 'Bag-in-Box',
                    options: [{ value: '5 L', option: { title: 'Size' } }],
                    calculated_price: {
                      calculated_amount: 800,
                      original_amount: 800,
                      currency_code: 'dkk',
                      is_calculated_price_tax_inclusive: true,
                    },
                    prices: [
                      { amount: 700, min_quantity: 3, currency_code: 'dkk', rules_count: 0 },
                    ],
                  },
                  ...[false, true].map((isSale, index) => ({
                    id: `layout-single-${index}`,
                    sku: `sardino-rojo-single-${index}`,
                    variant_rank: index + 2,
                    title: 'Flaske',
                    options: [{ value: '75 cl', option: { title: 'Size' } }],
                    calculated_price: {
                      calculated_amount: 95,
                      original_amount: isSale ? 120 : 95,
                      currency_code: 'dkk',
                      is_calculated_price_tax_inclusive: true,
                    },
                    prices: [],
                  })),
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
    await expect(cards.first().getByTestId('grid-price')).toContainText(/kr|DKK/)
    if (path === '/') {
      await expect(cards).toHaveCount(4)
      const price = cards.first().getByTestId('grid-price')
      await expect(price).toContainText(/120[,.]00/)
      await expect(price.locator('s')).toContainText(/195[,.]00/)
      await expect(price).toContainText('Stykpris v/ 21 stk.')
      const boxPrice = cards.nth(1).getByTestId('grid-price')
      await expect(boxPrice).toContainText('Stykpris v/ 3 stk.')
      await expect(boxPrice).not.toContainText('flasker')
      const singlePrice = cards.nth(2).getByTestId('grid-price')
      await expect(singlePrice).toContainText(/95[,.]00/)
      await expect(singlePrice.locator('s')).toHaveCount(0)
      await expect(singlePrice).not.toContainText('Stykpris')
      const salePrice = cards.nth(3).getByTestId('grid-price')
      await expect(salePrice).toContainText(/95[,.]00/)
      await expect(salePrice.locator('s')).toContainText(/120[,.]00/)
      await expect(salePrice).not.toContainText('Stykpris')
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
      const uncenteredPairs = await cards.evaluateAll((items) =>
        items.flatMap((card) => {
          const price = card.querySelector('[data-testid="grid-price"]')
          if (!price || price.textContent?.includes('Stykpris')) return []
          const prices = [...price.children].map((child) => child.getBoundingClientRect())
          const bounds = card.getBoundingClientRect()
          const left = Math.min(...prices.map((price) => price.left))
          const right = Math.max(...prices.map((price) => price.right))
          return Math.abs((left + right - bounds.left - bounds.right) / 2) > 1
            ? [card.querySelector('h3')?.textContent]
            : []
        }),
      )
      expect(
        uncenteredPairs,
        `prices without a caption are centered together at ${width}px`,
      ).toEqual([])
      const bubbleOffsets = await cards.evaluateAll((items) =>
        items.flatMap((card) => {
          const bubble = card.querySelector('.discount-badge')?.parentElement
          if (!bubble) return []
          const bounds = bubble.getBoundingClientRect()
          const imageArea = bubble.parentElement!.getBoundingClientRect()
          return [
            [Math.round(imageArea.right - bounds.right), Math.round(bounds.top - imageArea.top)],
          ]
        }),
      )
      expect(
        new Set(bubbleOffsets.map((offset) => offset.join(','))).size,
        `sale and volume bubbles share a position at ${width}px`,
      ).toBeLessThanOrEqual(1)
    }
  })
}
