<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'
  import { vermouths, type Handle } from '$lib/data/products'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import Seo from '$lib/components/SEO.svelte'
  import {
    GA_CATEGORY_LABEL_BY_HANDLE,
    getProductListAnalyticsItem,
    trackSelectItem,
    trackViewItemList,
    type GaListItem,
  } from '$lib/helpers/analytics'
  import { getVariantGridItems, type EligibleProductVariant } from '$lib/helpers/product-variants'
  import { resolve } from '$app/paths'
  import type { HttpTypes } from '@medusajs/types'

  const { data }: PageProps = $props()
  const red = $derived(getVariantGridItems(data.categories.red))
  const white = $derived(getVariantGridItems(data.categories.white))
  const other = $derived(getVariantGridItems(data.categories.other))
  const packs = $derived(getVariantGridItems(data.categories.packs))
  const { locale, region } = $derived(data)
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

  function toGaItem(
    index: number,
    product: HttpTypes.StoreProduct,
    variant: EligibleProductVariant,
  ): GaListItem {
    const categoryHandle = getCategoryHandle(product)
    const handle = typeof product.handle === 'string' ? product.handle : null
    const staticData = handle && handle in vermouths ? vermouths[handle as Handle] : null
    return getProductListAnalyticsItem({
      brand: staticData?.brand,
      category: categoryHandle ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle] : undefined,
      index,
      listId: categoryHandle?.toUpperCase(),
      listName: categoryHandle ?? undefined,
      product,
      variant,
    })
  }

  function handleSelectItem(
    index: number,
    product: HttpTypes.StoreProduct,
    variant: EligibleProductVariant,
  ) {
    trackSelectItem({
      currency,
      item: toGaItem(index, product, variant),
    })
  }

  onMount(() => {
    const items = [
      ...red.map(({ product, variant }, index) => toGaItem(index + 1, product, variant)),
      ...white.map(({ product, variant }, index) => toGaItem(index + 1, product, variant)),
      ...other.map(({ product, variant }, index) => toGaItem(index + 1, product, variant)),
      ...packs.map(({ product, variant }, index) => toGaItem(index + 1, product, variant)),
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
  <a class="btn" href={resolve('/forhandlere')}>SE HVOR</a>
</section>

<Marquee text="ROJO // RØD //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each red as { product, variant }, index (variant.sku)}
    <ProductGridItem
      currencyCode={region.currency_code}
      {locale}
      {product}
      {variant}
      onSelectItem={() => handleSelectItem(index + 1, product, variant)}
    />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each white as { product, variant }, index (variant.sku)}
    <ProductGridItem
      currencyCode={region.currency_code}
      {locale}
      {product}
      {variant}
      onSelectItem={() => handleSelectItem(index + 1, product, variant)}
    />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each other as { product, variant }, index (variant.sku)}
    <ProductGridItem
      currencyCode={region.currency_code}
      {locale}
      {product}
      {variant}
      onSelectItem={() => handleSelectItem(index + 1, product, variant)}
    />
  {/each}
</ul>

<Marquee text="BUNDLES // PAKKER //" theme="pink"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each packs as { product, variant }, index (variant.sku)}
    <ProductGridItem
      currencyCode={region.currency_code}
      {locale}
      {product}
      {variant}
      onSelectItem={() => handleSelectItem(index + 1, product, variant)}
    />
  {/each}
</ul>

<section class="content border-b border-black">
  <h2>VIDSTE DU AT VI TILBYDER</h2>
  <p>
    Vermouth smagninger til både private og firmaer. Den helt rigtige måde at komme igang med
    vermouth på.
  </p>
  <a class="btn" href={resolve('/smagninger')}>BOOK EN SMAGNING</a>
</section>
