import type { StorefrontImage } from '$lib/data/products'
import type { HttpTypes } from '@medusajs/types'

export type ProductVariant = NonNullable<HttpTypes.StoreProduct['variants']>[number]
export type EligibleProductVariant = ProductVariant & {
  sku: string
  variant_rank: number
}

export type VariantPresentation = {
  packaging: string
  size: string
}

function hasCalculatedPrice(variant: ProductVariant) {
  return typeof variant.calculated_price?.calculated_amount === 'number'
}

function isEligibleVariant(variant: ProductVariant): variant is EligibleProductVariant {
  return (
    hasCalculatedPrice(variant) &&
    typeof variant.sku === 'string' &&
    Boolean(variant.sku.trim()) &&
    Number.isInteger(variant.variant_rank)
  )
}

export function getEligibleVariants(product: HttpTypes.StoreProduct): EligibleProductVariant[] {
  return (product.variants ?? [])
    .filter(isEligibleVariant)
    .toSorted((left, right) => left.variant_rank - right.variant_rank)
}

export function getDefaultVariant(product: HttpTypes.StoreProduct): EligibleProductVariant {
  const defaultVariant = getEligibleVariants(product)[0]
  if (!defaultVariant) {
    throw new Error(`Product ${product.handle ?? product.id ?? 'unknown'} has no eligible variant`)
  }

  return defaultVariant
}

export function getVariantBySku(
  variants: EligibleProductVariant[],
  requestedSku: string | null,
): EligibleProductVariant | null {
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
  variantSku,
  variantImages,
}: {
  variantSku: string
  variantImages?: Record<string, StorefrontImage>
}): StorefrontImage | null {
  return variantImages?.[variantSku] ?? null
}
