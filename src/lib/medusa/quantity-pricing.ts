import type { ProductVariant } from '$lib/helpers/product-variants'
import type { QuantityPricing } from '$lib/helpers/quantity-pricing'

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Read supported ordinary variant tiers from the Store product response. */
export function readVariantQuantityPricing(
  variant: ProductVariant,
  currencyCode: string,
): QuantityPricing | null {
  const calculated = variant.calculated_price
  const singleAmount = calculated?.calculated_amount
  if (
    typeof singleAmount !== 'number' ||
    !Number.isFinite(singleAmount) ||
    singleAmount <= 0 ||
    calculated?.currency_code !== currencyCode ||
    calculated.is_calculated_price_tax_inclusive !== true
  )
    return null

  const prices: unknown = (variant as ProductVariant & { prices?: unknown }).prices
  if (!Array.isArray(prices)) return null
  const tiers: QuantityPricing['tiers'] = []
  for (const price of prices) {
    if (!record(price)) return null
    if (price.currency_code !== currencyCode) continue
    // Do not guess regional, customer or price-list eligibility from raw rows.
    if (
      (price.price_list_id !== null && price.price_list_id !== undefined) ||
      price.rules_count !== 0
    )
      return null
    const min = price.min_quantity ?? 1
    const max = price.max_quantity ?? null
    if (
      typeof price.amount !== 'number' ||
      !Number.isFinite(price.amount) ||
      price.amount < 0 ||
      typeof min !== 'number' ||
      !Number.isSafeInteger(min) ||
      min < 1 ||
      (max !== null && (typeof max !== 'number' || !Number.isSafeInteger(max) || max < min))
    )
      return null
    if (min > 1)
      tiers.push({ minQuantity: min, maxQuantity: max as number | null, unitAmount: price.amount })
  }
  if (!tiers.some((tier) => tier.unitAmount < singleAmount)) return null
  return { variantId: variant.id, currencyCode, singleAmount, tiers }
}
