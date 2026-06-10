<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'
  import { vermouths, type Handle } from '$lib/data/products'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import Seo from '$lib/components/SEO.svelte'
  import {
    GA_CATEGORY_LABEL_BY_HANDLE,
    GA_MISSING,
    trackSelectItem,
    trackViewItemList,
    type GaListItem,
  } from '$lib/helpers/analytics'
  import type { HttpTypes } from '@medusajs/types'

  const { data }: PageProps = $props()
  const red = $derived.by(() => data.categories.red)
  const white = $derived.by(() => data.categories.white)
  const other = $derived.by(() => data.categories.other)
  const packs = $derived.by(() => data.categories.packs)
  const currency = $derived(data.region.currency_code.toUpperCase())

  type CategoryHandle = keyof typeof GA_CATEGORY_LABEL_BY_HANDLE

  function getCategoryHandle(product: HttpTypes.StoreProduct): CategoryHandle | null {
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

  function toGaItem(index: number, product: HttpTypes.StoreProduct): GaListItem {
    const categoryHandle = getCategoryHandle(product)
    const handle = typeof product.handle === 'string' ? product.handle : null
    const staticData = handle && handle in vermouths ? vermouths[handle as Handle] : null
    const price = product.variants?.[0]?.calculated_price?.calculated_amount

    return {
      item_id: product.id || GA_MISSING.itemId,
      item_name: product.title || GA_MISSING.itemName,
      price: price !== null && price !== undefined ? String(price) : GA_MISSING.price,
      item_brand: staticData?.brand || GA_MISSING.itemBrand,
      item_category: categoryHandle
        ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle]
        : GA_MISSING.itemCategory,
      item_list_name: categoryHandle || GA_MISSING.itemListName,
      item_list_id: categoryHandle ? categoryHandle.toUpperCase() : GA_MISSING.itemListId,
      index,
      quantity: '1',
    }
  }

  function handleSelectItem(index: number, product: HttpTypes.StoreProduct) {
    trackSelectItem({
      currency,
      item: toGaItem(index, product),
    })
  }

  onMount(() => {
    const items = [
      ...red.map((product, index) => toGaItem(index + 1, product)),
      ...white.map((product, index) => toGaItem(index + 1, product)),
      ...other.map((product, index) => toGaItem(index + 1, product)),
      ...packs.map((product, index) => toGaItem(index + 1, product)),
    ]

    trackViewItemList({
      currency,
      items,
    })
  })
</script>

<Seo
  title="Sortiment"
  description="Se vores store udvalg af Vermouth"
  image="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/7e25baa1-0230-42b8-e5e3-1de47fe1f300/public"
  imageAlt="Statue kigger på en spand fyldt med Vermouth flasker"
/>

<Marquee text="VERMOUTH ER FOR ALLE //" theme="red"></Marquee>

<section class="content border-b border-black">
  <h1>VIL DU SMAGE FØR DU KØBER?</h1>
  <p>Så frygt ej! Du kan smage vores lækre dråber på et udvalg af steder i København</p>
  <a class="btn" href="/forhandlere">SE HVOR</a>
</section>

<Marquee text="ROJO // RØD //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each red as product, index (product.id || product.handle)}
    <ProductGridItem {product} onSelectItem={() => handleSelectItem(index + 1, product)} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each white as product, index (product.id || product.handle)}
    <ProductGridItem {product} onSelectItem={() => handleSelectItem(index + 1, product)} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each other as product, index (product.id || product.handle)}
    <ProductGridItem {product} onSelectItem={() => handleSelectItem(index + 1, product)} />
  {/each}
</ul>

<Marquee text="BUNDLES // PAKKER //" theme="pink"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each packs as product, index (product.id || product.handle)}
    <ProductGridItem {product} onSelectItem={() => handleSelectItem(index + 1, product)} />
  {/each}
</ul>

<section class="content border-b border-black">
  <h2>VIDSTE DU AT VI TILBYDER</h2>
  <p>
    Vermouth smagninger til både private og firmaer. Den helt rigtige måde at komme igang med
    vermouth på.
  </p>
  <a class="btn" href="/smagninger">BOOK EN SMAGNING</a>
</section>
