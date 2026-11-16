import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import Page from './+page.svelte'
import type { PageData } from './$types'

function orderData(): PageData {
  return {
    locale: 'en-US',
    categories: { red: [], white: [], other: [], packs: [] },
    order: {
      id: 'order-discount-test',
      display_id: 39,
      currency_code: 'dkk',
      items: [
        {
          id: 'item-bottle',
          product_title: 'Test vermouth',
          variant_title: 'Flaske',
          quantity: 2,
          unit_price: 274.5,
          adjustments: [{ id: 'adjustment-item', code: 'SAVE10', amount: 54.9 }],
        },
      ],
      shipping_methods: [],
      shipping_total: 49,
      discount_total: 54.9,
      discount_tax_total: 10.98,
      total: 543.1,
    },
  } as unknown as PageData
}

function summary(data: PageData) {
  const { body } = render(Page, { props: { data } })
  return body
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

describe('order discount summary', () => {
  it('shows the tax-inclusive discount and code while preserving Medusa’s final total', () => {
    expect(summary(orderData())).toContain('Rabat (SAVE10) -DKK 54.90 Total DKK 543.10')
  })

  it('keeps non-discounted order lines, shipping, and total unchanged', () => {
    const data = orderData()
    data.order.discount_total = 0
    data.order.total = 598
    delete data.order.items![0].adjustments
    data.order.shipping_methods = null

    const text = summary(data)
    expect(text).toContain(
      'Test vermouth · Flaske x 2 DKK 549.00 Levering DKK 49.00 Total DKK 598.00',
    )
    expect(text).not.toContain('Rabat')
  })

  it('shows a generic discount line when adjustment metadata is unavailable', () => {
    const data = orderData()
    delete data.order.items![0].adjustments
    data.order.shipping_methods = null

    expect(summary(data)).toContain('Rabat -DKK 54.90 Total DKK 543.10')
  })

  it('uses adjustment descriptions when codes are absent and lists each label only once', () => {
    const data = orderData()
    data.order.items![0].adjustments = [
      { description: 'Velkomstrabat', amount: 30 },
      { code: 'SAVE10', amount: 24.9 },
    ] as NonNullable<PageData['order']['items']>[number]['adjustments']
    data.order.shipping_methods = [
      { adjustments: [{ code: 'SAVE10', amount: 0 }] },
    ] as PageData['order']['shipping_methods']

    expect(summary(data)).toContain('Rabat (Velkomstrabat, SAVE10) -DKK 54.90 Total DKK 543.10')
  })

  it('shows shipping discounts once, with the original delivery charge', () => {
    const data = orderData()
    delete data.order.items![0].adjustments
    data.order.shipping_methods = [
      { adjustments: [{ code: 'FREESHIP', amount: 49 }] },
    ] as PageData['order']['shipping_methods']
    data.order.shipping_total = 0
    data.order.original_shipping_total = 49
    data.order.shipping_discount_total = 49
    data.order.discount_total = 49
    data.order.total = 549

    expect(summary(data)).toContain(
      'Levering DKK 49.00 Rabat (FREESHIP) -DKK 49.00 Total DKK 549.00',
    )
  })
})
