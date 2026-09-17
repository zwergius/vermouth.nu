import { formatPrice } from '$lib/helpers/numbers'
import { describe, expect, it } from 'vitest'
import { quantityChoices, quantityPrice, type QuantityPricing } from './quantity-pricing'

const pricing: QuantityPricing = {
  variantId: 'bottle',
  currencyCode: 'dkk',
  singleAmount: 295,
  tiers: [
    { minQuantity: 3, maxQuantity: null, unitAmount: 273 },
    { minQuantity: 6, maxQuantity: null, unitAmount: 250 },
  ],
}

describe('quantity prices', () => {
  it.each([
    [1, 295],
    [2, 295],
    [3, 273],
    [5, 273],
    [6, 250],
    [7, 250],
    [2, 295],
  ])('prices all %i bottles at %i', (quantity, unitAmount) => {
    expect(quantityPrice(pricing, quantity)).toMatchObject({
      unitAmount,
      total: quantity * unitAmount,
      comparisonTotal: quantity * 295,
    })
  })
  it('uses dynamic thresholds and honours maximum quantities', () => {
    const custom = { ...pricing, tiers: [{ minQuantity: 4, maxQuantity: 8, unitAmount: 200 }] }
    expect(quantityChoices(custom).map((p) => p.quantity)).toEqual([1, 4])
    expect(quantityPrice(custom, 8)?.total).toBe(1600)
    expect(quantityPrice(custom, 9)?.total).toBe(2655)
  })
  it('compares against the current sale and suppresses a tier with no extra saving', () => {
    const sale = { ...pricing, singleAmount: 260 }
    expect(quantityChoices(sale).map((p) => p.quantity)).toEqual([1, 6])
    expect(quantityPrice(sale, 3)).toMatchObject({ total: 780, isDiscounted: false })
    expect(quantityPrice(sale, 6)).toMatchObject({
      total: 1500,
      comparisonTotal: 1560,
      isDiscounted: true,
    })
  })
  it.each([0, -1, 1.5, NaN, Infinity])('does not preview invalid quantity %s', (q) => {
    expect(quantityPrice(pricing, q)).toBeNull()
  })
  it('deduplicates and sorts choices', () => {
    expect(
      quantityChoices({
        ...pricing,
        tiers: [...pricing.tiers].reverse().concat(pricing.tiers),
      }).map((p) => p.quantity),
    ).toEqual([1, 3, 6])
  })
  it('uses a DKK prefix with the existing Danish amount format', () => {
    expect(formatPrice(1500, 'dkk', 'da-DK', true)).toBe('DKK 1.500,00')
  })
})
