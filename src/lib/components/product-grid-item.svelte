<script lang="ts">
  import { vermouths, type Handle } from '$lib/data/products'
  import { productSrcSet } from '$lib/helpers/images'
  import { getProductPriceDisplay } from '$lib/helpers/prices'
  import { resolve } from '$app/paths'
  import { HttpTypes } from '@medusajs/types'

  const {
    currencyCode,
    locale,
    product,
    onSelectItem,
  }: {
    currencyCode: string
    locale: string
    product: HttpTypes.StoreProduct
    onSelectItem?: () => void
  } = $props()
  const { image, origin } = $derived(vermouths[product.handle as Handle])
  const priceDisplay = $derived(getProductPriceDisplay(product, currencyCode, locale))

  function handleSelectItem() {
    onSelectItem?.()
  }
</script>

<li class="grid-item aspect-[0.677/1] px-11 pb-7 pt-6 md:aspect-square md:py-6">
  <a
    class="flex h-full flex-col items-center"
    href={resolve(`/sortiment/${product.handle}`)}
    onclick={handleSelectItem}
  >
    <h3 class="mb-2 whitespace-nowrap text-lg font-bold text-brand-blue md:mb-4">
      {product.title}
    </h3>
    <p class="whitespace-nowrap text-xs">{origin}</p>
    <div class="relative flex flex-1 flex-col">
      <img
        alt={product.title}
        class="my-auto w-auto md:max-h-44 lg:max-h-fit"
        loading="lazy"
        srcset={productSrcSet(image)}
        src="{image}/w=145,h=290,fit=cover"
        sizes="(max-width: 700px) 145px, (max-width: 1000px) 90px, 145px"
        width="290"
        height="290"
      />
      <div class="overlay">
        <p class="btn whitespace-nowrap">KØB NU</p>
      </div>
      {#if priceDisplay?.savingsPercent}
        <div
          aria-label="Spar {priceDisplay.savingsPercent}%"
          class="discount-badge absolute z-10 flex aspect-square flex-col items-center justify-center rounded-full bg-white text-center font-bold text-brand-red"
        >
          <span class="discount-label">SPAR</span>
          <span class="discount-percent">{priceDisplay.savingsPercent}%</span>
        </div>
      {/if}
    </div>
    <div class="min-h-11 text-center text-xs">
      <p>{product.subtitle}</p>
      {#if priceDisplay}
        <p class="mt-2 font-bold">
          {#if priceDisplay.isDiscounted}
            <span class="sr-only">Tilbudspris </span>{priceDisplay.current}
            <span class="ml-1 font-normal line-through opacity-70">
              <span class="sr-only">Normalpris </span>{priceDisplay.original}
            </span>
          {:else}
            {priceDisplay.current}
          {/if}
        </p>
      {/if}
    </div>
  </a>
</li>

<style lang="postcss">
  li.grid-item {
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
    left: 50%;
    top: 40%;
    width: clamp(5.25rem, 16vw, 6.75rem);
    padding: 0.9rem;
    gap: 0.8rem;
    line-height: 0.9;
    translate: calc(-128% - 60px) -112%;
    scale: 0;
    rotate: 8deg;
    animation: discount-badge-pop 650ms cubic-bezier(0.16, 1.25, 0.32, 1) 180ms forwards;
  }

  .discount-label {
    font-size: clamp(1rem, 0.85rem + 0.4vw, 1.25rem);
    translate: 0 -0.1rem;
    text-box: trim-both cap alphabetic;
  }

  .discount-percent {
    font-size: clamp(1.55rem, 1.25rem + 0.75vw, 2.15rem);
    text-box: trim-both cap alphabetic;
  }

  @keyframes discount-badge-pop {
    0% {
      scale: 0;
      rotate: 8deg;
    }
    68% {
      scale: 1.08;
      rotate: -7deg;
    }
    100% {
      scale: 1;
      rotate: -10deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .discount-badge {
      animation: none;
      scale: 1;
      rotate: -10deg;
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
