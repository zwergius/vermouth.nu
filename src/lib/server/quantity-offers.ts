import { env } from '$env/dynamic/private'
import { sdk } from '$lib/medusa'
import { readVariantQuantityPricing } from '$lib/medusa/quantity-pricing'
import type { QuantityPricing } from '$lib/helpers/quantity-pricing'
import type { HttpTypes } from '@medusajs/types'

export async function loadQuantityOffers(
  products: HttpTypes.StoreProduct[],
  region: HttpTypes.StoreRegion,
) {
  // Explicit opt-in while public Price List discovery is unresolved (Medusa #16836).
  const enabled = new Set(
    (env.QUANTITY_OFFER_VARIANT_IDS ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  )
  const productIds = products
    .filter((product) => product.variants?.some((variant) => enabled.has(variant.id)))
    .map((product) => product.id)
  const offers: Record<string, QuantityPricing> = {}
  if (!productIds.length) return offers
  try {
    const { products: withPrices } = await sdk.store.product.list({
      id: productIds,
      limit: productIds.length,
      region_id: region.id,
      fields: 'id,*variants.prices,*variants.calculated_price',
    })
    for (const product of withPrices) {
      for (const variant of product.variants ?? []) {
        if (!enabled.has(variant.id)) continue
        const pricing = readVariantQuantityPricing(variant, region.currency_code)
        if (pricing) offers[variant.id] = pricing
      }
    }
  } catch {
    // Offers are optional: a discovery failure must not prevent ordinary purchases.
    console.error('Quantity offer discovery failed')
  }
  return offers
}
