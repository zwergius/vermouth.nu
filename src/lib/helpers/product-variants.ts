import type { StorefrontImage } from '$lib/data/products'
import type { HttpTypes } from '@medusajs/types'

export type ProductVariant = NonNullable<HttpTypes.StoreProduct['variants']>[number]

export type VariantPresentation = {
  packaging: string
  size: string
}

function hasCalculatedPrice(variant: ProductVariant) {
  return typeof variant.calculated_price?.calculated_amount === 'number'
}

function hasStableIdentity(variant: ProductVariant) {
  return Boolean(variant.sku?.trim()) && Number.isInteger(variant.variant_rank)
}

export function getEligibleVariants(product: HttpTypes.StoreProduct): ProductVariant[] {
  return (product.variants ?? [])
    .filter((variant) => hasCalculatedPrice(variant) && hasStableIdentity(variant))
    .toSorted((left, right) => left.variant_rank! - right.variant_rank!)
}

export function getDefaultVariant(product: HttpTypes.StoreProduct): ProductVariant | null {
  return getEligibleVariants(product)[0] ?? null
}

export function getVariantBySku(
  variants: ProductVariant[],
  requestedSku: string | null,
): ProductVariant | null {
  if (!requestedSku) return null
  return variants.find(({ sku }) => sku === requestedSku) ?? null
}

export function getVariantPresentation(variant: ProductVariant): VariantPresentation {
  const size =
    variant.options?.find(({ option }) => option?.title.toLowerCase() === 'size')?.value ??
    variant.options?.[0]?.value ??
    ''

  return {
    packaging: variant.title?.trim() || 'Variant',
    size,
  }
}

export function getVariantLabel(variant: ProductVariant) {
  const { packaging, size } = getVariantPresentation(variant)
  return size ? `${packaging} — ${size}` : packaging
}

export function getLineItemVariantLabel({
  optionValues,
  title,
}: {
  optionValues?: Record<string, unknown> | null
  title?: string | null
}) {
  const sizeEntry = Object.entries(optionValues ?? {}).find(
    ([optionTitle, value]) => optionTitle.toLowerCase() === 'size' && typeof value === 'string',
  )
  const firstValue = Object.values(optionValues ?? {}).find((value) => typeof value === 'string')
  const size = (sizeEntry?.[1] ?? firstValue) as string | undefined
  const packaging = title?.trim() || 'Variant'

  return size ? `${packaging} — ${size}` : packaging
}

export function getVariantImage({
  fallbackImage,
  productTitle,
  variant,
  variantCount,
  variantImages,
}: {
  fallbackImage: string
  productTitle: string
  variant: ProductVariant
  variantCount: number
  variantImages?: Record<string, StorefrontImage>
}): StorefrontImage | null {
  const configuredImage = variant.sku ? variantImages?.[variant.sku] : undefined
  if (configuredImage) return configuredImage
  if (variantCount !== 1) return null

  const { packaging, size } = getVariantPresentation(variant)
  return {
    altText: [productTitle, packaging, size].filter(Boolean).join(' – '),
    url: fallbackImage,
  }
}
