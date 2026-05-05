<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'
  import { vermouths, type Handle } from '$lib/data/products'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import Seo from '$lib/components/SEO.svelte'
  import { trackViewItemList, type GaListItem } from '$lib/helpers/analytics'
  import type { HttpTypes } from '@medusajs/types'

  const { data }: PageProps = $props()
  const red = $derived.by(() => data.categories.red)
  const white = $derived.by(() => data.categories.white)
  const other = $derived.by(() => data.categories.other)
  const currency = $derived(data.region.currency_code.toUpperCase())

  const categoryLabel: Record<'red' | 'white' | 'other', string> = {
    red: 'Red Vermouth',
    white: 'White Vermouth',
    other: 'Orange Vermouth',
  }

  function isTrackableProduct(
    product: HttpTypes.StoreProduct,
  ): product is HttpTypes.StoreProduct & {
    id: string
    title: string
    handle: Handle
  } {
    return (
      typeof product.id === 'string' &&
      typeof product.title === 'string' &&
      typeof product.handle === 'string' &&
      product.handle in vermouths
    )
  }

  const itemsToTrack = $derived.by(() => {
    const items: GaListItem[] = []
    let index = 1

    for (const product of red) {
      if (!isTrackableProduct(product)) continue
      items.push(mapProductToGaItem(product, 'red', index++))
    }

    for (const product of white) {
      if (!isTrackableProduct(product)) continue
      items.push(mapProductToGaItem(product, 'white', index++))
    }

    for (const product of other) {
      if (!isTrackableProduct(product)) continue
      items.push(mapProductToGaItem(product, 'other', index++))
    }

    return items
  })

  function mapProductToGaItem(
    product: HttpTypes.StoreProduct & { id: string; title: string; handle: Handle },
    category: keyof typeof categoryLabel,
    index: number,
  ): GaListItem {
    const staticData = vermouths[product.handle]
    const price = product.variants?.[0]?.calculated_price?.calculated_amount
    const itemListName = category

    return {
      item_id: product.id,
      item_name: product.title,
      price: price !== null && price !== undefined ? String(price) : undefined,
      item_brand: staticData.brand,
      item_category: categoryLabel[category],
      item_list_name: itemListName,
      item_list_id: itemListName.toUpperCase(),
      index,
      quantity: '1',
    }
  }

  onMount(() => {
    trackViewItemList({
      currency,
      items: itemsToTrack,
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
  {#each red as product (product.id || product.handle)}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each white as product (product.id || product.handle)}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each other as product (product.id || product.handle)}
    <ProductGridItem {product} />
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
