import {
  getDefaultVariant,
  getEligibleVariants,
  getLineItemVariantLabel,
  getVariantBySku,
  getVariantImage,
  getVariantImageAltText,
  getVariantLabel,
  getVariantPriceDisplay,
  getVariantGridItems,
} from '$lib/helpers/product-variants'
import type { HttpTypes } from '@medusajs/types'
import { describe, expect, it } from 'vitest'

function variant({
  id,
  price = 100,
  rank,
  size,
  sku,
  title,
}: {
  id: string
  price?: number
  rank: number
  size: string
  sku: string
  title: string
}) {
  return {
    id,
    sku,
    title,
    variant_rank: rank,
    calculated_price: { calculated_amount: price },
    options: [{ value: size, option: { title: 'Size' } }],
  } as HttpTypes.StoreProductVariant
}

function product(variants: HttpTypes.StoreProductVariant[]) {
  return { variants } as HttpTypes.StoreProduct
}

const bottle = variant({
  id: 'bottle',
  rank: 0,
  size: '75 cl',
  sku: 'wine-75cl-bottle',
  title: 'Flaske',
})
const box = variant({
  id: 'box',
  price: 800,
  rank: 1,
  size: '5 L',
  sku: 'wine-5l-bag-in-box',
  title: 'Bag-in-Box',
})

describe('product variant selection', () => {
  it('orders eligible variants by rank rather than response order', () => {
    expect(getEligibleVariants(product([box, bottle]))).toEqual([bottle, box])
    expect(getDefaultVariant(product([box, bottle]))).toBe(bottle)
  })

  it('expands products into rank-ordered grid items without changing product order', () => {
    const firstProduct = { id: 'first', variants: [box, bottle] } as HttpTypes.StoreProduct
    const secondVariant = variant({
      id: 'second-bottle',
      rank: 0,
      size: '75 cl',
      sku: 'second-wine-75cl-bottle',
      title: 'Flaske',
    })
    const secondProduct = {
      id: 'second',
      variants: [secondVariant],
    } as HttpTypes.StoreProduct

    expect(getVariantGridItems([firstProduct, secondProduct])).toEqual([
      { product: firstProduct, variant: bottle },
      { product: firstProduct, variant: box },
      { product: secondProduct, variant: secondVariant },
    ])
  })

  it('rejects a product without an eligible variant', () => {
    expect(() => getDefaultVariant(product([]))).toThrow('has no eligible variant')
  })

  it('rejects duplicate eligible SKUs and ranks', () => {
    expect(() => getEligibleVariants(product([bottle, { ...box, sku: bottle.sku }]))).toThrow(
      'duplicate eligible variant SKU',
    )
    expect(() =>
      getEligibleVariants(product([bottle, { ...box, variant_rank: bottle.variant_rank }])),
    ).toThrow('duplicate eligible variant rank')
  })

  it('excludes a variant without an active-region calculated price', () => {
    const unavailable = {
      ...box,
      calculated_price: undefined,
    } as HttpTypes.StoreProductVariant

    expect(getEligibleVariants(product([unavailable, bottle]))).toEqual([bottle])
  })

  it('restores an eligible variant from its stable SKU', () => {
    const eligible = getEligibleVariants(product([box, bottle]))

    expect(getVariantBySku(eligible, box.sku)).toBe(box)
    expect(getVariantBySku(eligible, 'legacy-variant-id')).toBeNull()
  })

  it('combines the translated packaging title and Size option', () => {
    expect(getVariantLabel(box)).toBe('Bag-in-Box — 5 L')
    expect(
      getLineItemVariantLabel({
        product: product([bottle, box]),
        sku: box.sku,
        title: 'Bag-in-Box',
      }),
    ).toBe('Bag-in-Box — 5 L')
  })

  it('falls back to line-item option values when the catalog variant is unavailable', () => {
    expect(
      getLineItemVariantLabel({
        optionValues: { Size: '5 L' },
        title: 'Bag-in-Box',
      }),
    ).toBe('Bag-in-Box — 5 L')
  })
})

describe('variant storefront images', () => {
  it('resolves the selected variant image by SKU', () => {
    expect(
      getVariantImage({
        fallbackAltText: 'Wine – Bag-in-Box, 5 L',
        variantSku: box.sku!,
        variantImages: {
          [box.sku!]: { altText: 'Wine box', url: 'box-image' },
        },
      }),
    ).toEqual({ altText: 'Wine box', url: 'box-image' })
  })

  it('does not show another presentation image for a multi-variant product', () => {
    expect(
      getVariantImage({
        fallbackAltText: 'Wine – Bag-in-Box, 5 L',
        variantSku: box.sku!,
      }),
    ).toBeNull()
  })

  it('does not resolve a missing SKU mapping', () => {
    expect(
      getVariantImage({
        fallbackAltText: 'Wine – Bag-in-Box, 5 L',
        variantSku: 'other-75cl-bottle',
        variantImages: {
          [bottle.sku!]: { altText: 'Wine bottle', url: 'bottle-image' },
        },
      }),
    ).toBeNull()
  })

  it('composes alt text when the configured image has none', () => {
    const fallbackAltText = getVariantImageAltText('Wine', getVariantLabel(box))

    expect(
      getVariantImage({
        fallbackAltText,
        variantSku: box.sku!,
        variantImages: {
          [box.sku!]: { url: 'box-image' },
        },
      }),
    ).toEqual({ altText: 'Wine – Bag-in-Box, 5 L', url: 'box-image' })
  })
})

describe('variant prices', () => {
  it('formats the selected variant price', () => {
    expect(getVariantPriceDisplay(box, 'dkk', 'da-DK')[0]).toMatchObject({
      current: expect.stringMatching(/800[,.]00/),
      isDiscounted: false,
    })
  })
})

describe('variant price displays', () => {
  const tiered = {
    ...bottle,
    calculated_price: {
      calculated_amount: 295,
      original_amount: 295,
      currency_code: 'dkk',
      is_calculated_price_tax_inclusive: true,
    },
    prices: [
      { amount: 273, min_quantity: 3, max_quantity: 5, currency_code: 'dkk', rules_count: 0 },
      { amount: 250, min_quantity: 6, max_quantity: null, currency_code: 'dkk', rules_count: 0 },
    ],
  } as unknown as HttpTypes.StoreProductVariant

  it('returns one display for an ordinary variant and n displays for tiers', () => {
    expect(getVariantPriceDisplay(box, 'dkk', 'en-GB')).toHaveLength(1)
    const displays = getVariantPriceDisplay(tiered, 'dkk', 'en-GB')
    expect(displays.map(({ quantity }) => quantity)).toEqual([1, 3, 6])
    expect(displays[1]).toMatchObject({
      current: 'DKK\u00a0819.00',
      unit: 'DKK\u00a0273.00',
      savingsPercent: 7,
    })
    expect(displays[2].savingsPercent).toBe(15)
  })
  it.each([
    [1, 295],
    [2, 590],
    [3, 819],
    [4, 1092],
    [5, 1365],
    [6, 1500],
    [7, 1750],
  ])('resolves quantity %s using the same display', (quantity, total) => {
    expect(getVariantPriceDisplay(tiered, 'dkk', 'en-GB', quantity)[0].current).toBe(
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'dkk',
        currencyDisplay: 'code',
      }).format(total),
    )
  })
  it('keeps ordinary sale pricing and compares tiers with the current single price', () => {
    const sale = {
      ...tiered,
      calculated_price: {
        ...tiered.calculated_price!,
        calculated_amount: 260,
        original_amount: 295,
      },
    }
    const displays = getVariantPriceDisplay(sale, 'dkk', 'en-GB')
    expect(displays.map(({ quantity }) => quantity)).toEqual([1, 6])
    expect(displays[0].isDiscounted).toBe(true)
    expect(displays[1].original).toBe('DKK\u00a01,560.00')
  })
  it.each([0, -1, 1.5, NaN, Infinity])('ignores invalid quantity %s', (quantity) => {
    expect(getVariantPriceDisplay(tiered, 'dkk', 'en-GB', quantity)).toEqual([])
  })
  it('falls back to one price for unsupported tier rules and tax context', () => {
    expect(
      getVariantPriceDisplay(
        {
          ...tiered,
          prices: [{ amount: 100, min_quantity: 3, currency_code: 'dkk', rules_count: 1 }],
        } as unknown as HttpTypes.StoreProductVariant,
        'dkk',
        'en-GB',
      ),
    ).toHaveLength(1)
    expect(
      getVariantPriceDisplay(
        {
          ...tiered,
          calculated_price: {
            ...tiered.calculated_price!,
            is_calculated_price_tax_inclusive: false,
          },
        },
        'dkk',
        'en-GB',
      ),
    ).toHaveLength(1)
  })
})
