<script lang="ts">
  import type { PageData } from './$types'
  import { squareSrcSet } from '$lib/helpers/images'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import ProductSliders from '$lib/components/product-sliders.svelte'

  export let data: PageData
</script>

<Marquee text="{data.vermouth.name} //" theme="red"></Marquee>

<section class="split-content border-b border-black lg:flex-row-reverse">
  <div class="copy">
    <p class="text-xs mb-6">{data.vermouth.titleName}</p>
    <h1 class="text-2xl mb-6">{data.vermouth.name}</h1>
    <p class="text-xs mb-6">{data.vermouth.origin}</p>
    <a class="btn mb-12 2xl:mb-24" href="/forhandlere">KØB ELLER SMAG HER</a>
    <h3 class="text-sm font-bold mb-4">{data.vermouth.titleName}</h3>
    <p class="text-sm mb-6">{data.vermouth.intro}</p>
    <h3 class="text-sm font-bold mb-4">Smag & Duft</h3>
    <p class="text-sm mb-6">{data.vermouth.taste}</p>
    <h3 class="text-sm font-bold mb-4">Anbefaling</h3>
    <p class="text-sm">{data.vermouth.recommendation}</p>
  </div>
  <div class="border-b border-black lg:border-0 py-10 lg:py-20 flex justify-center">
    <div class="max-w-screen lg:max-w-4xl lg:mx-auto">
      <img
        alt={data.vermouth.name}
        class="h-full max-h-[896px] w-auto object-cover max-w-full"
        srcset={squareSrcSet(data.vermouth.image)}
        src="{data.vermouth.image}/w=400,h=400,fit=cover"
        sizes="(max-width: 500px) 100vw, (max-width: 1792px) 50vw, 896px"
        width="450"
        height="450"
      />
    </div>
  </div>
</section>

<ul class="lg:grid lg:grid-cols-3 border-b border-black overflow-visible">
  <li class="relative aspect-square">
    <img
      alt={data.vermouth.extraImages[0].altText}
      class="h-full w-full object-cover"
      width="400"
      height="400"
      loading="lazy"
      src="{data.vermouth.extraImages[0].url}/w=800,h=800,fit=cover"
      srcset={squareSrcSet(data.vermouth.extraImages[0].url)}
      sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
    />
  </li>
  <li class="relative aspect-square flex flex-col justify-center border-x border-black">
    <ProductSliders scores={data.vermouth.scores} />
  </li>
  <li class="relative aspect-square">
    <img
      alt={data.vermouth.extraImages[1].altText}
      class="h-full w-full object-cover"
      width="400"
      height="400"
      loading="lazy"
      src="{data.vermouth.extraImages[1].url}/w=800,h=800,fit=cover"
      srcset={squareSrcSet(data.vermouth.extraImages[1].url)}
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
  {#each data.redVermouths as product}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each data.whiteVermouths as product}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each data.otherVermouths as product}
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
