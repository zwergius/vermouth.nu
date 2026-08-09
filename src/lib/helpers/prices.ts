import {
  getDefaultVariant,
  getVariantPriceDisplay,
  type ProductPriceDisplay,
} from '$lib/helpers/product-variants'
import type { HttpTypes } from '@medusajs/types'

export function getProductPriceDisplay(
  product: HttpTypes.StoreProduct,
  currencyCode: string,
  locale: string,
): ProductPriceDisplay | null {
  return getVariantPriceDisplay(getDefaultVariant(product), currencyCode, locale)
}
