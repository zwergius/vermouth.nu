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
  quantity: number
  unit: string
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

// Ordinary prices are exposed on the variant; Price List tiers are not yet exposed by Medusa.
type VariantPrice = {
  amount: number
  currency_code: string
  min_quantity?: number | null
  max_quantity?: number | null
  rules_count?: number
  price_list_id?: string | null
}

function getVariantTiers(variant: ProductVariant, currency: string): VariantPrice[] {
  if (
    variant.calculated_price?.currency_code !== currency ||
    !variant.calculated_price.is_calculated_price_tax_inclusive
  )
    return []
  const prices = (variant as ProductVariant & { prices?: VariantPrice[] }).prices
  if (!Array.isArray(prices)) return []
  const matching = prices.filter((price) => price?.currency_code === currency)
  for (const price of matching) {
    const min = price.min_quantity ?? 1
    const max = price.max_quantity ?? min
    const validAmount = Number.isFinite(price.amount) && price.amount >= 0
    const validMin = Number.isSafeInteger(min) && min >= 1
    const validMax = Number.isSafeInteger(max) && max >= min
    const hasRules = Boolean(price.price_list_id) || price.rules_count !== 0

    if (!validAmount || !validMin || !validMax || hasRules) return []
  }
  return matching.filter((price) => (price.min_quantity ?? 1) > 1)
}

export function getVariantPriceDisplay(
  variant: ProductVariant,
  currencyCode: string,
  locale: string,
  quantity?: number,
): ProductPriceDisplay[] {
  const price = variant.calculated_price as CalculatedPrice | undefined
  const calculatedAmount = toAmount(price?.calculated_amount)
  if (calculatedAmount === null || !Number.isFinite(calculatedAmount)) return []
  const tiers = getVariantTiers(variant, currencyCode)
  const quantities =
    quantity === undefined
      ? [...new Set([1, ...tiers.map((tier) => tier.min_quantity!)])].sort((a, b) => a - b)
      : [quantity]

  return quantities
    .filter((count) => Number.isSafeInteger(count) && count > 0)
    .flatMap((count) => {
      const unitAmount = Math.min(
        calculatedAmount,
        ...tiers
          .filter(
            (tier) =>
              count >= tier.min_quantity! &&
              (tier.max_quantity === null ||
                tier.max_quantity === undefined ||
                count <= tier.max_quantity),
          )
          .map((tier) => tier.amount),
      )
      // Compare volume savings with today's single price, including any current sale.
      const originalAmount =
        unitAmount < calculatedAmount ? calculatedAmount : toAmount(price?.original_amount)
      const isDiscounted = originalAmount !== null && originalAmount > unitAmount
      if (quantity === undefined && count > 1 && unitAmount >= calculatedAmount) return []
      return [
        {
          quantity: count,
          unit: formatPrice(unitAmount, currencyCode, locale),
          current: formatPrice(unitAmount * count, currencyCode, locale),
          original: isDiscounted
            ? formatPrice(originalAmount * count, currencyCode, locale)
            : undefined,
          savingsPercent: isDiscounted
            ? Math.round((1 - unitAmount / originalAmount) * 100)
            : undefined,
          isDiscounted,
        },
      ]
    })
}
