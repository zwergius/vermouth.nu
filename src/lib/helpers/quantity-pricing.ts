import { formatPrice } from '$lib/helpers/numbers'

/** Shopper-context prices supplied by a verified source, independent of Medusa transport. */
export type QuantityPricing = {
  variantId: string
  currencyCode: string
  singleAmount: number
  tiers: { minQuantity: number; maxQuantity: number | null; unitAmount: number }[]
}

export function quantityPrice(pricing: QuantityPricing, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) return null
  const applicable = pricing.tiers.filter(
    (tier) =>
      quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity),
  )
  const unitAmount = Math.min(pricing.singleAmount, ...applicable.map((tier) => tier.unitAmount))
  const total = unitAmount * quantity
  const comparisonTotal = pricing.singleAmount * quantity
  if (!Number.isFinite(total) || !Number.isFinite(comparisonTotal)) return null
  return { quantity, unitAmount, total, comparisonTotal, isDiscounted: total < comparisonTotal }
}

export function quantityChoices(pricing: QuantityPricing) {
  return [...new Set([1, ...pricing.tiers.map((tier) => tier.minQuantity)])]
    .sort((a, b) => a - b)
    .map((quantity) => quantityPrice(pricing, quantity))
    .filter(
      (price): price is NonNullable<typeof price> =>
        price !== null && (price.quantity === 1 || price.isDiscounted),
    )
}

export function formatQuantityPrice(amount: number, currency: string, locale: string) {
  // Retain the existing formatter's amount/locale rules, with the agreed currency prefix.
  const code = currency.toUpperCase()
  return `${code} ${formatPrice(amount, currency, locale).replace(code, '').trim()}`
}
