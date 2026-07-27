import { formatPrice } from '$lib/helpers/numbers'
import { getDefaultVariant, type ProductVariant } from '$lib/helpers/product-variants'
import type { HttpTypes } from '@medusajs/types'

type CalculatedPrice = NonNullable<ProductVariant['calculated_price']> & {
  calculated_amount?: number | null
  original_amount?: number | null
}

export type ProductPriceDisplay = {
  current: string
  original?: string
  savingsPercent?: number
  isDiscounted: boolean
}

function toAmount(amount: number | null | undefined): number | null {
  return typeof amount === 'number' ? amount : null
}

export function getProductPriceDisplay(
  product: HttpTypes.StoreProduct,
  currencyCode: string,
  locale: string,
): ProductPriceDisplay | null {
  return getVariantPriceDisplay(getDefaultVariant(product), currencyCode, locale)
}

export function getVariantPriceDisplay(
  variant: ProductVariant,
  currencyCode: string,
  locale: string,
): ProductPriceDisplay | null {
  const price = variant.calculated_price as CalculatedPrice | undefined
  const calculatedAmount = toAmount(price?.calculated_amount)

  if (calculatedAmount === null) {
    return null
  }

  const originalAmount = toAmount(price?.original_amount)
  const isDiscounted = originalAmount !== null && originalAmount > calculatedAmount
  const savingsPercent = isDiscounted
    ? Math.round(((originalAmount - calculatedAmount) / originalAmount) * 100)
    : undefined

  return {
    current: formatPrice(calculatedAmount, currencyCode, locale),
    original: isDiscounted ? formatPrice(originalAmount, currencyCode, locale) : undefined,
    savingsPercent,
    isDiscounted,
  }
}
