import type { StorefrontImage } from '$lib/data/products'
import { formatPrice } from '$lib/helpers/numbers'
import type { HttpTypes } from '@medusajs/types'

export type ProductVariant = NonNullable<HttpTypes.StoreProduct['variants']>[number]
export type EligibleProductVariant = ProductVariant & {
  sku: string
  variant_rank: number
}

export type VariantGridItem = {
  product: HttpTypes.StoreProduct
  variant: EligibleProductVariant
}

export type VariantPresentation = {
  packaging: string
  size: string
}

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

export type ResolvedStorefrontImage = StorefrontImage & {
  altText: string
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
  const eligibleVariants = (product.variants ?? []).filter(isEligibleVariant)
  const skus = new Set<string>()
  const ranks = new Set<number>()

  for (const variant of eligibleVariants) {
    if (skus.has(variant.sku)) {
      throw new Error(
        `Product ${product.handle ?? product.id ?? 'unknown'} has duplicate eligible variant SKU ${variant.sku}`,
      )
    }
    if (ranks.has(variant.variant_rank)) {
      throw new Error(
        `Product ${product.handle ?? product.id ?? 'unknown'} has duplicate eligible variant rank ${variant.variant_rank}`,
      )
    }

    skus.add(variant.sku)
    ranks.add(variant.variant_rank)
  }

  return eligibleVariants.toSorted((left, right) => left.variant_rank - right.variant_rank)
}

export function getDefaultVariant(product: HttpTypes.StoreProduct): EligibleProductVariant {
  const defaultVariant = getEligibleVariants(product)[0]
  if (!defaultVariant) {
    throw new Error(`Product ${product.handle ?? product.id ?? 'unknown'} has no eligible variant`)
  }

  return defaultVariant
}

export function getVariantGridItems(products: HttpTypes.StoreProduct[]): VariantGridItem[] {
  return products.flatMap((product) =>
    getEligibleVariants(product).map((variant) => ({ product, variant })),
  )
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

export function getVariantImageAltText(productTitle: string, variantLabel: string) {
  return `${productTitle} – ${variantLabel.replace(' — ', ', ')}`
}

export function getLineItemVariantLabel({
  optionValues,
  product,
  sku,
  title,
}: {
  optionValues?: Record<string, unknown> | null
  product?: HttpTypes.StoreProduct | null
  sku?: string | null
  title?: string | null
}) {
  const catalogVariant = product && sku ? getVariantBySku(getEligibleVariants(product), sku) : null
  if (catalogVariant) return getVariantLabel(catalogVariant)

  const sizeEntry = Object.entries(optionValues ?? {}).find(
    ([optionTitle, value]) => optionTitle.toLowerCase() === 'size' && typeof value === 'string',
  )
  const firstValue = Object.values(optionValues ?? {}).find((value) => typeof value === 'string')
  const size = (sizeEntry?.[1] ?? firstValue) as string | undefined
  const packaging = title?.trim() || 'Variant'

  return size ? `${packaging} — ${size}` : packaging
}

export function getVariantImage({
  fallbackAltText,
  variantSku,
  variantImages,
}: {
  fallbackAltText: string
  variantSku: string
  variantImages?: Record<string, StorefrontImage>
}): ResolvedStorefrontImage | null {
  const image = variantImages?.[variantSku]
  if (!image) return null

  return {
    ...image,
    altText: image.altText?.trim() || fallbackAltText,
  }
}

function toAmount(amount: number | null | undefined): number | null {
  return typeof amount === 'number' ? amount : null
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
