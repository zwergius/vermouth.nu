<script lang="ts">
  import { vermouths, type Handle } from '$lib/data/products'
  import { productSrcSet } from '$lib/helpers/images'
  import {
    getEligibleVariants,
    getVariantImage,
    getVariantImageAltText,
    getVariantLabel,
    getVariantPriceDisplay,
    getVariantPresentation,
    type EligibleProductVariant,
  } from '$lib/helpers/product-variants'
  import { resolve } from '$app/paths'
  import type { HttpTypes } from '@medusajs/types'
  import type { Attachment } from 'svelte/attachments'

  const {
    currencyCode,
    locale,
    product,
    variant,
    onSelectItem,
  }: {
    currencyCode: string
    locale: string
    product: HttpTypes.StoreProduct
    variant: EligibleProductVariant
    onSelectItem?: () => void
  } = $props()
  const { alcoholPercentage, image, origin, variantImages } = $derived(
    vermouths[product.handle as Handle],
  )
  const eligibleVariantCount = $derived(getEligibleVariants(product).length)
  const presentation = $derived(getVariantPresentation(variant))
  const imageAltText = $derived(getVariantImageAltText(product.title, getVariantLabel(variant)))
  const configuredImage = $derived(
    getVariantImage({
      fallbackAltText: imageAltText,
      variantSku: variant.sku,
      variantImages,
    }),
  )
  const storefrontImage = $derived(
    configuredImage ?? (eligibleVariantCount === 1 ? { altText: imageAltText, url: image } : null),
  )
  const priceDisplays = $derived(getVariantPriceDisplay(variant, currencyCode, locale))
  const priceDisplay = $derived(priceDisplays[0])
  const advertisedPrice = $derived(
    priceDisplays.reduce(
      (lowest, price) => (price.unitAmount < lowest.unitAmount ? price : lowest),
      priceDisplay,
    ),
  )
  const hasVolumePrice = $derived(advertisedPrice?.quantity > 1)
  const comparisonPrice = $derived(hasVolumePrice ? priceDisplay?.unit : advertisedPrice?.original)
  let isDiscountBadgeVisible = $state(false)

  function handleSelectItem() {
    onSelectItem?.()
  }

  const revealDiscountBadge: Attachment<HTMLDivElement> = (node) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      isDiscountBadgeVisible = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        isDiscountBadgeVisible = true
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }
</script>

<li class="grid-item aspect-[0.677/1] px-11 pb-7 pt-6 md:aspect-square md:py-6">
  <a
    class="flex h-full flex-col items-center"
    href={resolve(`/shop/${product.handle}?variant=${encodeURIComponent(variant.sku)}`)}
    onclick={handleSelectItem}
  >
    <h3 class="mb-2 whitespace-nowrap text-lg font-bold text-brand-blue md:mb-4">
      {product.title}
    </h3>
    <p class="whitespace-nowrap text-xs">{origin}</p>
    <div class="relative min-h-0 w-full flex-1">
      <img
        alt={storefrontImage?.altText ?? imageAltText}
        class="absolute inset-0 h-full w-full object-contain"
        loading="lazy"
        srcset={storefrontImage ? productSrcSet(storefrontImage.url) : undefined}
        src={storefrontImage ? `${storefrontImage.url}/w=145,h=290,fit=cover` : undefined}
        sizes="(max-width: 700px) 145px, (max-width: 1000px) 90px, 145px"
        width="290"
        height="290"
      />
      <div class="overlay">
        <p class="btn whitespace-nowrap">KØB NU</p>
      </div>
      {#if advertisedPrice?.savingsPercent}
        <div
          aria-label="Spar {hasVolumePrice ? 'op til ' : ''}{advertisedPrice.savingsPercent}%"
          class:discount-badge-visible={isDiscountBadgeVisible}
          class="absolute right-0 top-2 z-10"
          {@attach revealDiscountBadge}
        >
          <div
            class="discount-badge flex flex-col items-center justify-center rounded-full bg-white text-center font-bold leading-none text-brand-red"
            class:gap-0={hasVolumePrice}
            class:gap-1={!hasVolumePrice}
            class:md:gap-3={!hasVolumePrice}
          >
            <span class="text-[clamp(0.875rem,4.5cqi,1rem)]" class:leading-tight={hasVolumePrice}>
              SPAR
              {#if hasVolumePrice}
                <span class="block text-[clamp(0.75rem,3.5cqi,0.875rem)] leading-tight">op til</span
                >
              {/if}
            </span>
            <span class="text-[clamp(1.25rem,6cqi,1.75rem)]">{advertisedPrice.savingsPercent}%</span
            >
          </div>
        </div>
      {/if}
    </div>
    <div class="min-h-11 shrink-0 self-stretch text-center text-xs">
      <p>{product.subtitle}</p>
      <p class="mt-1 font-bold">
        {presentation.packaging} · {presentation.size} · {alcoholPercentage}
      </p>
      {#if advertisedPrice}
        <div
          class="mt-2 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-baseline gap-x-2"
          class:grid={hasVolumePrice}
          class:flex={!hasVolumePrice}
          class:justify-center={!hasVolumePrice}
          data-testid="grid-price"
        >
          {#if comparisonPrice}
            <s class="col-start-1 row-start-1 justify-self-end whitespace-nowrap opacity-70">
              <span class="sr-only">Normalpris </span>{comparisonPrice}
            </s>
          {/if}
          <p class="col-start-2 row-start-1 whitespace-nowrap font-bold">
            {#if advertisedPrice.isDiscounted}
              <span class="sr-only">Tilbudspris </span>
            {/if}
            {advertisedPrice.unit}
          </p>
          {#if hasVolumePrice}
            <p class="col-start-3 row-start-1 justify-self-start whitespace-nowrap text-[0.625rem]">
              Stykpris v/ {advertisedPrice.quantity} stk.
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </a>
</li>

<style lang="postcss">
  li.grid-item {
    container-type: inline-size;
    --rotation-duration: 500ms;
    --filter-delay: 200ms;
    --filter-duration: 300ms;
  }
  img {
    filter: blur(0);
    transition:
      transform var(--rotation-duration) ease-in-out,
      filter var(--filter-duration) ease-in-out;
  }

  .overlay {
    @apply absolute inset-y-0 flex flex-col justify-center left-1/2 -translate-x-1/2;
    opacity: 0;
    transition: opacity var(--filter-duration) ease-in-out;
  }

  .discount-badge {
    width: clamp(4.5rem, 30cqi, 7rem);
    height: clamp(4.5rem, 30cqi, 7rem);
    padding: clamp(0.5rem, 3cqi, 0.875rem);
    rotate: -8deg;
  }

  .discount-badge-visible .discount-badge {
    animation: discount-badge-rotate 420ms ease-out 140ms forwards;
  }

  @keyframes discount-badge-rotate {
    0% {
      rotate: -8deg;
    }
    55% {
      rotate: 12deg;
    }
    100% {
      rotate: 10deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .discount-badge {
      rotate: 10deg;
    }
  }

  @media (hover: hover) {
    li.grid-item:hover img {
      transform: rotate(360deg);
      filter: blur(20px);
      transition:
        transform var(--rotation-duration) ease-in-out,
        filter var(--filter-duration) ease-in-out var(--filter-delay);
    }
    li.grid-item:hover .overlay {
      opacity: 100;
      transition: opacity var(--filter-duration) ease-in-out var(--filter-delay);
    }
  }
</style>
