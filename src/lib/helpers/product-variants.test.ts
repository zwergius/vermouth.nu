import {
  getDefaultVariant,
  getEligibleVariants,
  getLineItemVariantLabel,
  getPresentationImage,
  getVariantBySku,
  getVariantImage,
  getVariantImageAltText,
  getVariantLabel,
  getVariantPriceDisplay,
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

  it('uses the legacy product image only for a single-variant product', () => {
    expect(
      getPresentationImage({
        configuredImage: null,
        fallbackAltText: 'Wine – Flaske, 75 cl',
        fallbackImage: 'legacy-image',
        variantCount: 1,
      }),
    ).toEqual({ altText: 'Wine – Flaske, 75 cl', url: 'legacy-image' })
  })

  it('preserves a missing image for an unmapped multi-variant presentation', () => {
    expect(
      getPresentationImage({
        configuredImage: null,
        fallbackAltText: 'Wine – Bag-in-Box, 5 L',
        fallbackImage: 'bottle-image',
        variantCount: 2,
      }),
    ).toBeNull()
  })
})

describe('variant prices', () => {
  it('formats the selected variant price', () => {
    expect(getVariantPriceDisplay(box, 'dkk', 'da-DK')).toMatchObject({
      current: expect.stringMatching(/800[,.]00/),
      isDiscounted: false,
    })
  })
})
