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
  import { formatPrice } from '$lib/helpers/numbers'
  import { Form, QuantitySelector } from '$lib/components/form-controls'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import ProductSliders from '$lib/components/product-sliders.svelte'
  import Seo from '$lib/components/SEO.svelte'
  import { page } from '$app/state'
  import { untrack } from 'svelte'

  const { slug } = $derived(page.params)
  const { data }: PageProps = $props()
  const { red, white, other } = $derived(data.categories)
  const { cart, locale, product, region } = $derived(data)
  const { extraImages, image, origin, recommendation, scores, taste } = $derived(
    vermouths[product.handle as Handle],
  )
  const productDescription = $derived(product.description ?? '')
  const variant = $derived(product.variants?.[0])
  const formattedPrice = $derived(
    formatPrice(variant?.calculated_price?.calculated_amount ?? 0, region.currency_code, locale),
  )
  const cartItem = $derived(cart?.items?.find(({ variant_id }) => variant_id === variant?.id))
  type QuantityActionSuccess = { success: true; quantity: number }

  let buttonState = $state<'default' | 'loading' | 'success' | 'error'>('default')
  let isFormSubmitting = $state(false)

  const buttonText = $derived.by(() => {
    if (buttonState === 'loading') return 'VENT...'
    if (buttonState === 'success') return cartItem ? 'OPDATERET!' : 'TILFØJET!'
    if (buttonState === 'error') return 'FEJL'
    return 'LÆG I KURV'
  })

  const buttonColorClass = $derived.by(() => {
    if (buttonState === 'loading') return 'bg-brand-blue/70'
    if (buttonState === 'success') return 'bg-green-600'
    if (buttonState === 'error') return 'bg-red-600'
    return 'bg-brand-blue'
  })

  function getCategoryHandle(): keyof typeof GA_CATEGORY_LABEL_BY_HANDLE | null {
    for (const category of product.categories ?? []) {
      if (category.handle === 'red' || category.handle === 'white' || category.handle === 'other') {
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
    if (isFormSubmitting && buttonState === 'default') {
      buttonState = 'loading'
    } else if (!isFormSubmitting && buttonState === 'loading') {
      buttonState = 'default'
    }
  })

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
    <p class=" font-bold text-xs mb-4">{product.subtitle}</p>
    <h1 class="text-2xl mb-2">{product.title}</h1>
    <p class="font-bold text-xs mb-4">{origin}</p>
    <p class="font-bold text-base mb-6">
      {formattedPrice}
    </p>
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
            disabled={buttonState !== 'default'}
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
      href="/forhandlere">KØB ELLER SMAG HER &#8594;</a
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

<section class="content md:hidden border-b border-black">
  <h2>VIL DU SMAGE FØR DU KØBER SÅ FRYGT EJ!</h2>
  <p>Du kan smage vores lækre dråber på et udvalg af barer & restauranter i København</p>
  <a class="btn" href="/inspiration">SE HVOR</a>
</section>

<Marquee text="ROJO // RØD //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each red as product (product.id)}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each white as product (product.id)}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each other as product (product.id)}
    <ProductGridItem {product} />
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
  <a class="btn" href="/inspiration">DYK NED I VORES MANGE DRINKSOPSKRIFTER</a>
</section>
