import { describe, expect, it } from 'vitest'
import { getProductPriceDisplay } from '$lib/helpers/prices'
import type { HttpTypes } from '@medusajs/types'

const formatDkk = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'dkk',
  currencyDisplay: 'code',
}).format

function productWithPrice(
  calculatedAmount?: number,
  originalAmount?: number,
): HttpTypes.StoreProduct {
  return {
    variants: [
      {
        calculated_price: {
          calculated_amount: calculatedAmount,
          original_amount: originalAmount,
        },
      },
    ],
  } as HttpTypes.StoreProduct
}

describe('getProductPriceDisplay', () => {
  it('returns the sale price, original price, and savings percentage', () => {
    expect(getProductPriceDisplay(productWithPrice(160, 200), 'dkk', 'da-DK')).toEqual({
      current: formatDkk(160),
      original: formatDkk(200),
      savingsPercent: 20,
      isDiscounted: true,
    })
  })

  it('does not mark equal prices as discounted', () => {
    expect(getProductPriceDisplay(productWithPrice(200, 200), 'dkk', 'da-DK')).toEqual({
      current: formatDkk(200),
      original: undefined,
      savingsPercent: undefined,
      isDiscounted: false,
    })
  })

  it('returns null when Medusa did not calculate a price', () => {
    expect(getProductPriceDisplay(productWithPrice(), 'dkk', 'da-DK')).toBeNull()
  })
})
