<script lang="ts">
  import { page } from '$app/state'
  import { QuantitySelector, RadioGroup } from '$lib/components/form-controls'
  import { squareSrcSet } from '$lib/helpers/images'
  import { replacePrototypeUrl } from './prototype-navigation'

  // PROTOTYPE — three product-selector directions, switched with ?prototype=A|B|C.
  // ?variant remains reserved for the selected SKU, matching the VNU-30 contract.

  type PrototypeVariant = {
    cartQuantity: number
    description: string
    packaging: string
    price: string
    size: string
    sku: string
    visual: 'bottle' | 'box'
  }

  const variants: PrototypeVariant[] = [
    {
      cartQuantity: 2,
      description: 'Den klassiske flaske til hjemmebaren.',
      packaging: 'Flaske',
      price: '149 kr.',
      size: '75 cl',
      sku: 'SARDINO-ROJO-75CL',
      visual: 'bottle',
    },
    {
      cartQuantity: 0,
      description: 'Mere vermouth og mindre emballage.',
      packaging: 'Bag-in-Box',
      price: '599 kr.',
      size: '5 L',
      sku: 'SARDINO-ROJO-BIB-5L',
      visual: 'box',
    },
  ]

  const prototypeNames = {
    A: 'Klassiske rækker',
    B: 'Formatkort',
    C: 'Valg + detaljer',
  } as const

  type PrototypeKey = keyof typeof prototypeNames

  const {
    baseImage,
    origin,
    productSubtitle,
    productTitle,
  }: {
    baseImage: string
    origin: string
    productSubtitle?: string | null
    productTitle: string
  } = $props()

  function prototypeFromUrl(url: URL): PrototypeKey {
    const requested = url.searchParams.get('prototype')
    return requested === 'B' || requested === 'C' ? requested : 'A'
  }

  function selectedSkuFromUrl(url: URL) {
    const requested = url.searchParams.get('variant')
    return variants.some(({ sku }) => sku === requested) ? requested! : variants[0].sku
  }

  let prototypeKey = $state<PrototypeKey>(prototypeFromUrl(page.url))
  let selectedSku = $state(selectedSkuFromUrl(page.url))
  const selectedVariant = $derived(variants.find(({ sku }) => sku === selectedSku) ?? variants[0])
  let statusMessage = $state('')

  function replaceSearchParam(name: string, value: string) {
    const nextUrl = new URL(page.url)
    nextUrl.searchParams.set(name, value)
    replacePrototypeUrl(nextUrl, page.state)
  }

  function selectVariant(event: Event & { currentTarget: HTMLInputElement }) {
    statusMessage = ''
    selectedSku = event.currentTarget.value
    replaceSearchParam('variant', selectedSku)
  }

  function cyclePrototype(direction: -1 | 1) {
    const keys = Object.keys(prototypeNames) as PrototypeKey[]
    const currentIndex = keys.indexOf(prototypeKey)
    const nextIndex = (currentIndex + direction + keys.length) % keys.length
    prototypeKey = keys[nextIndex]
    replaceSearchParam('prototype', prototypeKey)
  }

  function handlePrototypeKeys(event: KeyboardEvent) {
    const target = event.target
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return
    }

    if (event.key === 'ArrowLeft') cyclePrototype(-1)
    if (event.key === 'ArrowRight') cyclePrototype(1)
  }

  function simulateCartUpdate() {
    statusMessage = `${selectedVariant.packaging} · ${selectedVariant.size} ville blive opdateret i kurven.`
  }
</script>

<svelte:window onkeydown={handlePrototypeKeys} />

<section class="split-content border-b border-black lg:flex-row-reverse">
  <div class="copy">
    <p class="mb-4 text-xs font-bold">{productSubtitle}</p>
    <h1 class="mb-2 text-2xl">{productTitle}</h1>
    <p class="mb-6 text-xs font-bold">{origin}</p>

    {#if prototypeKey === 'B'}
      <fieldset class="mb-6">
        <legend class="mb-4 text-sm font-bold">Vælg format</legend>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each variants as variant (variant.sku)}
            <label
              class="relative grid min-h-40 cursor-pointer content-between border border-black p-5 transition-colors has-[:checked]:bg-brand-blue has-[:checked]:text-white"
            >
              <input
                checked={selectedSku === variant.sku}
                class="absolute right-4 top-4 size-5 accent-black"
                name="prototype-variant-b"
                onchange={selectVariant}
                type="radio"
                value={variant.sku}
              />
              <span class="pr-8 text-xs font-bold uppercase">{variant.packaging}</span>
              <span class="text-2xl font-bold">{variant.size}</span>
              <span class="mt-5 flex items-end justify-between gap-3 text-xs">
                <span>{variant.description}</span>
                <strong class="whitespace-nowrap">{variant.price}</strong>
              </span>
            </label>
          {/each}
        </div>
      </fieldset>
    {:else if prototypeKey === 'C'}
      <fieldset
        class="mb-6 border border-black sm:grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <legend class="sr-only">Vælg format</legend>
        <div class="border-b border-black sm:border-b-0 sm:border-r">
          <p class="border-b border-black px-5 py-3 text-xs font-bold uppercase">Format</p>
          {#each variants as variant (variant.sku)}
            <label
              class="flex cursor-pointer items-center gap-3 border-b border-black px-5 py-4 last:border-b-0 has-[:checked]:bg-white/50"
            >
              <input
                checked={selectedSku === variant.sku}
                class="size-5 shrink-0 accent-black"
                name="prototype-variant-c"
                onchange={selectVariant}
                type="radio"
                value={variant.sku}
              />
              <span class="text-xs font-bold">{variant.packaging}</span>
            </label>
          {/each}
        </div>
        <div class="grid content-center gap-3 bg-white/30 p-6" aria-live="polite">
          <p class="text-xs font-bold uppercase">Dit valg</p>
          <p class="text-2xl font-bold">{selectedVariant.packaging} · {selectedVariant.size}</p>
          <p class="text-xs">{selectedVariant.description}</p>
          <p class="text-base font-bold">{selectedVariant.price}</p>
        </div>
      </fieldset>
    {/if}

    <div class="mb-4 flex items-center justify-between gap-4">
      <button class="btn min-w-48 justify-center" onclick={simulateCartUpdate} type="button">
        {selectedVariant.cartQuantity ? 'OPDATER KURV' : 'LÆG I KURV'}
      </button>
      {#key selectedSku}
        <QuantitySelector
          min={1}
          name="prototype-quantity"
          value={selectedVariant.cartQuantity || 1}
        />
      {/key}
    </div>

    {#if prototypeKey === 'A'}
      <div
        class="mb-4 mt-6 lg:[&_fieldset>ul]:grid lg:[&_fieldset>ul]:grid-cols-2 lg:[&_fieldset>ul>li]:border-b-0 lg:[&_fieldset>ul>li+li]:border-l"
      >
        <RadioGroup
          groupLabel="Vælg format"
          name="prototype-variant-a"
          onChange={selectVariant}
          options={variants.map((variant) => ({
            description: variant.description,
            label: `${variant.packaging} · ${variant.size}`,
            price: variant.price,
            value: variant.sku,
          }))}
          selected={selectedSku}
        />
      </div>
    {/if}

    <p class="min-h-5 text-xs" aria-live="polite">{statusMessage}</p>

    <details class="mt-6 border-t border-black pt-4 text-xs">
      <summary class="cursor-pointer font-bold">Vis prototype-state</summary>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono">
        <dt>prototype</dt>
        <dd>{prototypeKey}</dd>
        <dt>sku</dt>
        <dd>{selectedVariant.sku}</dd>
        <dt>format</dt>
        <dd>{selectedVariant.packaging} · {selectedVariant.size}</dd>
        <dt>pris</dt>
        <dd>{selectedVariant.price}</dd>
        <dt>kurv</dt>
        <dd>{selectedVariant.cartQuantity || 0}</dd>
      </dl>
    </details>
  </div>

  <div
    class="flex w-full justify-center border-b border-black py-10 lg:basis-1/2 lg:border-0 lg:py-20"
  >
    <div class="flex aspect-square w-full max-w-[896px] items-center justify-center lg:mx-auto">
      {#key selectedSku}
        {#if selectedVariant.visual === 'bottle'}
          <img
            alt={`${productTitle} ${selectedVariant.packaging} ${selectedVariant.size}`}
            class="h-full w-full object-contain"
            src="{baseImage}/w=400,h=400,fit=cover"
            srcset={squareSrcSet(baseImage)}
            sizes="(max-width: 500px) 100vw, (max-width: 1792px) 50vw, 896px"
            width="896"
            height="896"
          />
        {:else}
          <svg
            aria-labelledby="prototype-box-title"
            class="h-3/5 w-3/5 text-brand-blue"
            role="img"
            viewBox="0 0 400 400"
          >
            <title id="prototype-box-title">{productTitle} Bag-in-Box 5 L prototype</title>
            <path d="M55 75h290v250H55z" fill="currentColor" stroke="black" stroke-width="4" />
            <path d="M55 75l45-35h250l-5 35" fill="#fff" stroke="black" stroke-width="4" />
            <circle cx="315" cy="270" r="22" fill="#fff" stroke="black" stroke-width="4" />
            <text x="200" y="170" fill="#fff" font-size="30" font-weight="700" text-anchor="middle">
              SARDINO ROJO
            </text>
            <text x="200" y="215" fill="#fff" font-size="26" text-anchor="middle">BAG-IN-BOX</text>
            <text x="200" y="260" fill="#fff" font-size="36" font-weight="700" text-anchor="middle"
              >5 L</text
            >
          </svg>
        {/if}
      {/key}
    </div>
  </div>
</section>

<nav
  aria-label="Skift prototype"
  class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white bg-black px-3 py-2 text-xs text-white shadow-xl"
>
  <button
    aria-label="Forrige prototype"
    class="grid size-9 place-items-center rounded-full border border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    onclick={() => cyclePrototype(-1)}
    type="button"
  >
    ←
  </button>
  <p class="min-w-40 text-center font-bold">{prototypeKey} — {prototypeNames[prototypeKey]}</p>
  <button
    aria-label="Næste prototype"
    class="grid size-9 place-items-center rounded-full border border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    onclick={() => cyclePrototype(1)}
    type="button"
  >
    →
  </button>
</nav>
