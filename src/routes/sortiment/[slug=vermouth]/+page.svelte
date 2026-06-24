<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'
  import type { PageProps } from './$types'
  import { vermouths, type Handle } from '$lib/data/products'
  import {
    trackAddToCart,
    trackRemoveFromCart,
    GA_CATEGORY_LABEL_BY_HANDLE,
    GA_MISSING,
    trackViewItem,
    type GaListItem,
  } from '$lib/helpers/analytics'
  import { squareSrcSet } from '$lib/helpers/images'
  import { getProductPriceDisplay } from '$lib/helpers/prices'
  import { Form, QuantitySelector } from '$lib/components/form-controls'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import ProductSliders from '$lib/components/product-sliders.svelte'
  import Seo from '$lib/components/SEO.svelte'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { untrack } from 'svelte'

  const { slug } = $derived(page.params)
  const { data }: PageProps = $props()

  const REVIEWS_PAGE_SIZE = 2

  const { red, white, other, packs } = $derived(data.categories)
  const { cart, locale, product, region } = $derived(data)
  const { extraImages, image, origin, recommendation, scores, taste } = $derived(
    vermouths[product.handle as Handle],
  )
  const productDescription = $derived(product.description ?? '')
  const variant = $derived(product.variants?.[0])
  const priceDisplay = $derived(getProductPriceDisplay(product, region.currency_code, locale))
  const cartItem = $derived(cart?.items?.find(({ variant_id }) => variant_id === variant?.id))
  const reviews = $derived(data.reviews)
  const visibleReviews = $derived(data.reviews.reviews)
  const averageRating = $derived(Math.round(reviews.average_rating * 10) / 10)
  const formattedAverageRating = $derived(
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(averageRating),
  )
  const hasReviews = $derived(reviews.review_count > 0)
  const reviewCountLabel = $derived(
    `${reviews.review_count} ${reviews.review_count === 1 ? 'anmeldelse' : 'anmeldelser'}`,
  )
  const visibleReviewCount = $derived(reviews.offset + visibleReviews.length)
  const remainingReviewCount = $derived(Math.max(reviews.review_count - visibleReviewCount, 0))
  const hasMoreReviews = $derived(remainingReviewCount > 0)
  type QuantityActionSuccess = { success: true; quantity: number }

  let buttonState = $state<'default' | 'loading' | 'success' | 'error'>('default')
  let isFormSubmitting = $state(false)
  let isLoadingMoreReviews = $state(false)
  let reviewsLoadError = $state(false)

  const buttonText = $derived.by(() => {
    if (isFormSubmitting && buttonState === 'default') return 'VENT...'
    if (buttonState === 'success') return cartItem ? 'OPDATERET!' : 'TILFØJET!'
    if (buttonState === 'error') return 'FEJL'
    return 'LÆG I KURV'
  })

  const buttonColorClass = $derived.by(() => {
    if (isFormSubmitting && buttonState === 'default') return 'bg-brand-blue/70'
    if (buttonState === 'success') return 'bg-green-600'
    if (buttonState === 'error') return 'bg-red-600'
    return 'bg-brand-blue'
  })

  function getCategoryHandle(): keyof typeof GA_CATEGORY_LABEL_BY_HANDLE | null {
    for (const category of product.categories ?? []) {
      if (
        category.handle === 'red' ||
        category.handle === 'white' ||
        category.handle === 'other' ||
        category.handle === 'packs'
      ) {
        return category.handle
      }
    }

    return null
  }

  function toGaItem(quantity: string): GaListItem {
    const handle = typeof product.handle === 'string' ? product.handle : null
    const staticData = handle && handle in vermouths ? vermouths[handle as Handle] : null
    const price = product.variants?.[0]?.calculated_price?.calculated_amount
    const categoryHandle = getCategoryHandle()

    return {
      item_id: product.id || GA_MISSING.itemId,
      item_name: product.title || GA_MISSING.itemName,
      price: price !== null && price !== undefined ? String(price) : GA_MISSING.price,
      item_brand: staticData?.brand || GA_MISSING.itemBrand,
      item_category: categoryHandle
        ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle]
        : GA_MISSING.itemCategory,
      quantity,
    }
  }

  function getRatingPercentage(rating: number) {
    return `${Math.max(0, Math.min(5, rating)) * 20}%`
  }

  function formatReviewDate(date: string) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  async function loadMoreReviews() {
    const currentSlug = slug ?? product.handle
    if (!currentSlug || isLoadingMoreReviews || !hasMoreReviews) return

    isLoadingMoreReviews = true
    reviewsLoadError = false
    const nextSearchParams = new URLSearchParams(page.url.searchParams)
    const maxVisibleReviews = Math.max(reviews.review_count - reviews.offset, 0)
    nextSearchParams.set(
      'reviews_limit',
      String(Math.min(visibleReviews.length + REVIEWS_PAGE_SIZE, maxVisibleReviews)),
    )
    nextSearchParams.set('reviews_offset', String(reviews.offset))

    try {
      await goto(resolve(`/sortiment/${encodeURIComponent(currentSlug)}?${nextSearchParams}`), {
        keepFocus: true,
        noScroll: true,
        replaceState: true,
      })
    } catch (error) {
      console.error('load more product reviews failed with error: ', error)
      reviewsLoadError = true
    } finally {
      isLoadingMoreReviews = false
    }
  }

  function handleFormResult(result: ActionResult) {
    if (result.type === 'success') {
      const resultQuantity = (result.data as QuantityActionSuccess).quantity
      const previousQuantity = cartItem?.quantity ?? 0
      const quantityDelta = resultQuantity - previousQuantity

      if (quantityDelta > 0) {
        trackAddToCart({
          currency: region.currency_code.toUpperCase(),
          item: toGaItem(String(quantityDelta)),
        })
      }

      if (quantityDelta < 0) {
        trackRemoveFromCart({
          currency: region.currency_code.toUpperCase(),
          item: toGaItem(String(Math.abs(quantityDelta))),
        })
      }

      buttonState = 'success'
      setTimeout(() => {
        buttonState = 'default'
      }, 2000)
    } else {
      buttonState = 'error'
      setTimeout(() => {
        buttonState = 'default'
      }, 2000)
    }
  }

  $effect(() => {
    void slug

    untrack(() => {
      trackViewItem({
        currency: region.currency_code.toUpperCase(),
        item: toGaItem('1'),
      })
    })
  })
</script>

<Seo
  title={product.title}
  description={productDescription}
  image="{image}/w=800,h=800,fit=cover"
  imageAlt={product.title}
/>

<Marquee text="{product.title} //" theme="red"></Marquee>

<section class="split-content border-b border-black lg:flex-row-reverse">
  <div class="copy">
    {#if hasReviews}
      <div class="mb-8 flex flex-col items-start gap-3 text-brand-blue">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p
            class="relative inline-block text-[1.9375rem]/[1.9375rem] font-bold tracking-normal"
            aria-label="{formattedAverageRating} ud af 5 stjerner"
          >
            <span aria-hidden="true" class="text-brand-blue/25">★★★★★</span>
            <span
              aria-hidden="true"
              class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-brand-blue"
              style:width={getRatingPercentage(reviews.average_rating)}
            >
              ★★★★★
            </span>
          </p>
          <p class="text-xs font-bold text-black">{reviewCountLabel}</p>
        </div>
        <a class="text-xs font-bold underline underline-offset-2" href="#product-reviews">
          Læs {reviewCountLabel}
        </a>
      </div>
    {/if}
    <p class=" font-bold text-xs mb-4">{product.subtitle}</p>
    <h1 class="text-2xl mb-2">{product.title}</h1>
    <p class="font-bold text-xs mb-4">{origin}</p>
    {#if priceDisplay}
      <div class="mb-6">
        <p class="text-base font-bold">
          {#if priceDisplay.isDiscounted}
            <span class="sr-only">Tilbudspris </span>{priceDisplay.current}
            <span class="ml-2 text-sm font-normal line-through opacity-70">
              <span class="sr-only">Normalpris </span>{priceDisplay.original}
            </span>
          {:else}
            {priceDisplay.current}
          {/if}
        </p>
        {#if priceDisplay.savingsPercent}
          <p class="mt-1 text-xs font-bold text-brand-red">SPAR {priceDisplay.savingsPercent}%</p>
        {/if}
      </div>
    {/if}
    <div class="mb-4">
      <Form
        action="/kurv?/addOrUpdateItemQuantity"
        bind:isSubmitting={isFormSubmitting}
        onResult={handleFormResult}
      >
        <input name="variant_id" type="hidden" value={variant?.id} />
        <input name="cart_item_id" type="hidden" value={cartItem?.id} />
        <div class="flex items-center justify-between md:gap-4">
          <button
            class="btn transition-colors duration-300 min-w-48 justify-center {buttonColorClass}"
            disabled={buttonState !== 'default' || isFormSubmitting}
            type="submit"
          >
            {buttonText}
          </button>
          <QuantitySelector min={1} name="quantity" value={cartItem?.quantity} />
        </div>
      </Form>
    </div>
    <a
      class="block text-xs italic
      mb-10
      hover:font-bold"
      href={resolve('/forhandlere')}>KØB ELLER SMAG HER &#8594;</a
    >
    <h3 class="text-sm font-bold mb-4">{product.subtitle}</h3>
    <p class="text-sm mb-6">{productDescription}</p>
    <h3 class="text-sm font-bold mb-4">Smag & Duft</h3>
    <p class="text-sm mb-6">{taste}</p>
    <h3 class="text-sm font-bold mb-4">Anbefaling</h3>
    <p class="text-sm">{recommendation}</p>
  </div>
  <div
    class="border-b border-black lg:border-0 py-10 lg:py-20 flex justify-center w-full lg:basis-1/2"
  >
    <div class="aspect-square w-full max-w-[896px] lg:mx-auto">
      {#key image}
        <img
          alt={product.title}
          class="h-full w-full object-contain"
          srcset={squareSrcSet(image)}
          src="{image}/w=400,h=400,fit=cover"
          sizes="(max-width: 500px) 100vw, (max-width: 1792px) 50vw, 896px"
          width="896"
          height="896"
        />
      {/key}
    </div>
  </div>
</section>

<ul class="lg:grid lg:grid-cols-3 border-b border-black overflow-visible">
  <li class="relative aspect-square">
    <img
      alt={extraImages[0].altText}
      class="h-full w-full object-cover"
      width="400"
      height="400"
      loading="lazy"
      src="{extraImages[0].url}/w=800,h=800,fit=cover"
      srcset={squareSrcSet(extraImages[0].url)}
      sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
    />
  </li>
  <li class="relative aspect-square flex flex-col justify-center border-x border-black">
    <ProductSliders {scores} />
  </li>
  <li class="relative aspect-square">
    <img
      alt={extraImages[1].altText}
      class="h-full w-full object-cover"
      width="400"
      height="400"
      loading="lazy"
      src="{extraImages[1].url}/w=800,h=800,fit=cover"
      srcset={squareSrcSet(extraImages[1].url)}
      sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
    />
  </li>
</ul>

{#if hasReviews}
  <section
    class="border-b border-black px-11 py-12 text-brand-blue lg:px-20 lg:py-20 2xl:px-32"
    id="product-reviews"
  >
    <div class="mb-12 flex items-end justify-between gap-6 border-b border-black pb-5">
      <h2 class="text-base font-bold uppercase md:text-lg">SMAGT &amp; VURDERET</h2>
      <div class="text-right">
        <p
          class="text-xl font-bold md:text-[3rem]/[3.5rem]"
          aria-label="{formattedAverageRating} ud af 5 stjerner"
        >
          {formattedAverageRating}/5
        </p>
        <p class="text-xs font-bold text-black">{reviewCountLabel}</p>
      </div>
    </div>
    <ul class="grid gap-10 lg:grid-cols-2" id="product-review-list">
      {#each visibleReviews as review (review.id)}
        <li
          class="grid gap-4 border-t border-black pt-6 first:border-t-0 lg:[&:nth-child(-n+2)]:border-t-0"
        >
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p
              class="relative inline-block text-[1.5rem]/[1.5rem] font-bold"
              aria-label="{review.rating} ud af 5 stjerner"
            >
              <span aria-hidden="true" class="text-brand-blue/25">★★★★★</span>
              <span
                aria-hidden="true"
                class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-brand-blue"
                style:width={getRatingPercentage(review.rating)}
              >
                ★★★★★
              </span>
            </p>
            <p class="text-xs font-bold text-black">{formatReviewDate(review.created_at)}</p>
          </div>
          {#if review.title}
            <h3 class="text-sm font-bold text-black">{review.title}</h3>
          {/if}
          {#if review.content}
            <p class="max-w-[40rem] text-sm text-black">{review.content}</p>
          {/if}
          {#if review.reviewer_name}
            <p class="text-xs font-bold text-black">- {review.reviewer_name}</p>
          {/if}
        </li>
      {/each}
    </ul>
    {#if hasMoreReviews}
      <div class="mt-12 flex justify-center">
        <button
          class="btn justify-center transition-colors disabled:cursor-not-allowed disabled:bg-brand-blue/60"
          type="button"
          disabled={isLoadingMoreReviews}
          onclick={loadMoreReviews}
          aria-controls="product-review-list"
        >
          {isLoadingMoreReviews ? 'HENTER...' : `VIS FLERE (${remainingReviewCount})`}
        </button>
      </div>
    {/if}
    {#if reviewsLoadError}
      <p class="mt-4 text-center text-xs font-bold text-black" aria-live="polite">
        Kunne ikke hente flere anmeldelser. Prøv igen.
      </p>
    {/if}
  </section>
{/if}

<section class="content md:hidden border-b border-black">
  <h2>VIL DU SMAGE FØR DU KØBER SÅ FRYGT EJ!</h2>
  <p>Du kan smage vores lækre dråber på et udvalg af barer & restauranter i København</p>
  <a class="btn" href={resolve('/inspiration')}>SE HVOR</a>
</section>

<Marquee text="ROJO // RØD //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each red as product (product.id)}
    <ProductGridItem currencyCode={region.currency_code} {locale} {product} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each white as product (product.id)}
    <ProductGridItem currencyCode={region.currency_code} {locale} {product} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each other as product (product.id)}
    <ProductGridItem currencyCode={region.currency_code} {locale} {product} />
  {/each}
</ul>

<Marquee text="BUNDLES // PAKKER //" theme="pink"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each packs as product (product.id)}
    <ProductGridItem currencyCode={region.currency_code} {locale} {product} />
  {/each}
</ul>

<section class="content md:hidden border-b border-black">
  <h2>VIDSTE DU AT VI TILBYDER</h2>
  <p>
    Vermouth smagninger til både private og firmaer. Den helt rigtige måde at komme igang med
    vermouth på.
  </p>
  <a class="btn" href="mailto:info@vermouth.nu">BOOK EN SMAGNING</a>
</section>

<section class="content hidden md:block border-b border-black">
  <h2>Inspiration</h2>
  <p>Op dit cocktails-game med Vermouth</p>
  <a class="btn" href={resolve('/inspiration')}>DYK NED I VORES MANGE DRINKSOPSKRIFTER</a>
</section>
