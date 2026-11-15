import { error } from '@sveltejs/kit'
import { vermouths, type Handle } from '$lib/data/products'
import { getEligibleVariants, getVariantPriceDisplay } from '$lib/helpers/product-variants'
import { sdk } from '$lib/medusa'
import type { RequestHandler } from './$types'

const STOREFRONT_URL = 'https://www.vermouth.nu'
const PAGE_SIZE = 100

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const GET: RequestHandler = async () => {
  const { regions } = await sdk.store.region.list({ fields: 'id,currency_code,*countries' })
  const region = regions.find(({ countries }) => countries?.some(({ iso_2 }) => iso_2 === 'dk'))
  if (!region) error(503, 'The Danish feed region is unavailable')
  const currency = region.currency_code.toUpperCase()

  const items: string[] = []
  let offset = 0
  let count = 0
  do {
    const page = await sdk.store.product.list({
      fields: '*variants,*variants.calculated_price,*variants.prices,+variants.inventory_quantity',
      region_id: region.id,
      limit: PAGE_SIZE,
      offset,
      order: 'id',
    })
    if (!page.products.length) break
    count = page.count
    offset += page.products.length

    for (const product of page.products) {
      if (!Object.hasOwn(vermouths, product.handle)) continue

      const vermouth = vermouths[product.handle as Handle]
      for (const variant of getEligibleVariants(product)) {
        const [single, ...tiers] = getVariantPriceDisplay(variant, region.currency_code, 'da-DK')
        if (!single || single.unitAmount < 0) continue

        const originalBundleAmount =
          variant.title === 'Pakke' &&
          variant.calculated_price?.calculated_price?.price_list_type === 'sale'
            ? single.originalUnitAmount
            : undefined
        const price = (originalBundleAmount ?? single.unitAmount).toFixed(2)
        const salePrice = (
          originalBundleAmount === undefined
            ? Math.min(single.unitAmount, ...tiers.map(({ unitAmount }) => unitAmount))
            : single.unitAmount
        ).toFixed(2)

        const link = new URL(`/shop/${encodeURIComponent(product.handle)}`, STOREFRONT_URL)
        link.searchParams.set('variant', variant.sku)
        const storefrontImage = vermouth.variantImages?.[variant.sku]?.url
        const image = storefrontImage
          ? `${storefrontImage}/w=580,h=580,fit=cover`
          : variant.thumbnail || product.thumbnail || `${vermouth.image}/w=580,h=580,fit=cover`
        const inStock = variant.manage_inventory === false || (variant.inventory_quantity ?? 0) > 0
        const ean = variant.ean?.trim()
        const fields = {
          id: variant.id,
          item_group_id: product.id,
          title: product.title,
          description: product.description?.trim() || vermouth.taste,
          link: link.href,
          image_link: image,
          availability: inStock ? 'in_stock' : 'out_of_stock',
          condition: 'new',
          price: `${price} ${currency}`,
          ...(salePrice !== price ? { sale_price: `${salePrice} ${currency}` } : {}),
          brand: vermouth.brand,
          mpn: variant.sku,
          ...(ean ? { gtin: ean } : {}),
        }

        const xml = Object.entries(fields)
          .map(([key, value]) => `<g:${key}>${escapeXml(value)}</g:${key}>`)
          .join('')
        items.push(`<item>${xml}</item>`)
      }
    }
  } while (offset < count)

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Vermouth.nu</title>
<link>${STOREFRONT_URL}/shop</link>
<description>Vermouth.nu product feed</description>
${items.join('\n')}
</channel>
</rss>`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
  )
}
