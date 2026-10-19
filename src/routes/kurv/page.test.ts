import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import Page from './+page.svelte'
import type { PageProps } from './$types'

function cartData(withTiers: boolean, unitPrice: number): PageProps['data'] {
  const variant = {
    id: 'bottle',
    sku: 'forzudo-rojo-100cl-bottle',
    title: 'Flaske',
    options: [{ value: '100 cl', option: { title: 'Size' } }],
    calculated_price: {
      calculated_amount: 329,
      original_amount: 329,
      currency_code: 'dkk',
      is_calculated_price_tax_inclusive: true,
    },
    prices: [
      { amount: 329, currency_code: 'dkk', rules_count: 0 },
      ...(withTiers
        ? [
            { amount: 269, currency_code: 'dkk', min_quantity: 3, max_quantity: 5, rules_count: 0 },
            { amount: 249, currency_code: 'dkk', min_quantity: 6, rules_count: 0 },
          ]
        : []),
    ],
  }
  return {
    locale: 'en-US',
    purchasesPaused: false,
    region: { id: 'denmark', currency_code: 'dkk', countries: [{ iso_2: 'dk' }] },
    categories: {
      red: [{ id: 'forzudo', handle: 'forzudo-rojo', title: 'Forzudo Rojo', variants: [variant] }],
      white: [],
      other: [],
      packs: [],
    },
    cart: {
      id: 'cart',
      currency_code: 'dkk',
      items: [
        {
          id: 'line-bottle',
          variant_id: variant.id,
          variant_sku: variant.sku,
          variant_title: variant.title,
          product_handle: 'forzudo-rojo',
          product_title: 'Forzudo Rojo',
          quantity: withTiers ? 3 : 1,
          unit_price: unitPrice,
          total: unitPrice * (withTiers ? 3 : 1),
          is_tax_inclusive: true,
        },
      ],
      promotions: [],
      shipping_methods: [],
      item_total: 0,
      total: 0,
      tax_total: 0,
    },
    shippingOptions: [],
    shippingPrices: {},
  } as unknown as PageProps['data']
}

function activePrices(data: PageProps['data']) {
  const { body } = render(Page, { props: { data, form: null, params: {} } })
  const list = body.match(/<ul[^>]*data-testid="cart-unit-price"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? ''
  return [...list.matchAll(/<li[^>]*class="[^"]*\bfont-bold\b[^"]*"[^>]*>([\s\S]*?)<\/li>/g)].map(
    ([, price]) =>
      price
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
  )
}

describe('cart unit price fallback', () => {
  for (const withTiers of [false, true]) {
    it(`shows the authoritative cart price when the catalogue differs ${withTiers ? 'with' : 'without'} tiers`, () => {
      expect(activePrices(cartData(withTiers, 123))).toEqual(['DKK 123.00/stk.'])
    })
  }

  it('keeps a matching catalogue tier active', () => {
    expect(activePrices(cartData(true, 269))).toEqual(['DKK 269.00/stk. v. min 3 SPAR 18%'])
  })
})

it('shows Medusa’s discounted line total below the tier prices', () => {
  const data = cartData(true, 269)
  data.cart.items![0].total = 700
  const { body } = render(Page, { props: { data, form: null, params: {} } })
  const total = body.match(/data-testid="cart-item-total"[^>]*>([\s\S]*?)<\/p>/)?.[1]
  expect(
    total
      ?.replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  ).toBe('Samlet pris: 3 stk. DKK 700.00')
  expect(body.indexOf('data-testid="cart-item-total"')).toBeGreaterThan(
    body.indexOf('data-testid="cart-unit-price"'),
  )
})
