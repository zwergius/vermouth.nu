import { describe, expect, it } from 'vitest'
import type { ProductVariant } from '$lib/helpers/product-variants'
import { readVariantQuantityPricing } from './quantity-pricing'

const tier = {
  amount: 273,
  currency_code: 'dkk',
  min_quantity: 3,
  max_quantity: null,
  price_list_id: null,
  rules_count: 0,
}
function variant(prices: unknown = [tier], calculated = {}) {
  return {
    id: 'bottle',
    prices,
    calculated_price: {
      calculated_amount: 295,
      currency_code: 'dkk',
      is_calculated_price_tax_inclusive: true,
      ...calculated,
    },
  } as unknown as ProductVariant
}
describe('temporary Store tier adapter', () => {
  it('normalizes a verified variant without transporting Admin details', () => {
    expect(readVariantQuantityPricing(variant(), 'dkk')).toEqual({
      variantId: 'bottle',
      currencyCode: 'dkk',
      singleAmount: 295,
      tiers: [{ minQuantity: 3, maxQuantity: null, unitAmount: 273 }],
    })
  })
  it.each([
    undefined,
    null,
    {},
    [{ ...tier, amount: NaN }],
    [{ ...tier, min_quantity: 0 }],
    [{ ...tier, max_quantity: 2 }],
    [{ ...tier, rules_count: 1 }],
    [{ ...tier, price_list_id: 'private-list' }],
  ])('rejects missing or unsupported prices %j', (prices) => {
    const v = variant(null)
    Object.assign(v, { prices })
    expect(readVariantQuantityPricing(v, 'dkk')).toBeNull()
  })
  it('does not reuse another currency or unknown tax treatment', () => {
    expect(readVariantQuantityPricing(variant(), 'eur')).toBeNull()
    expect(
      readVariantQuantityPricing(
        variant([tier], { is_calculated_price_tax_inclusive: false }),
        'dkk',
      ),
    ).toBeNull()
  })
  it('hides tiers without a saving and leaves other variants independent', () => {
    expect(
      readVariantQuantityPricing(variant([tier], { calculated_amount: 200 }), 'dkk'),
    ).toBeNull()
    expect(readVariantQuantityPricing(variant([]), 'dkk')).toBeNull()
  })
})
