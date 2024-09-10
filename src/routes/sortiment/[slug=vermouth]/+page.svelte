<script lang="ts">
  import type { PageData } from './$types'
  import { squareSrcSet } from '$lib/helpers/images'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import ProductSliders from '$lib/components/product-sliders.svelte'

  export let data: PageData
</script>

<Marquee text="{data.vermouth.name} //" theme="red"></Marquee>

<section class="split-content border-b border-black flex-row-reverse">
  <div class="copy">
    <p class="text-xs mb-6">{data.vermouth.titleName}</p>
    <h1 class="text-2xl mb-6">{data.vermouth.name}</h1>
    <p class="text-xs mb-6">{data.vermouth.origin}</p>
    <a class="btn mb-12 2xl:mb-24" href="mailto:info@vermouth.nu">KØB ELLER SMAG HER</a>
    <h3 class="text-sm font-bold mb-4">{data.vermouth.titleName}</h3>
    <p class="text-sm mb-6">{data.vermouth.intro}</p>
    <h3 class="text-sm font-bold mb-4">Smag & Duft</h3>
    <p class="text-sm mb-6">{data.vermouth.taste}</p>
    <h3 class="text-sm font-bold mb-4">Anbefaling</h3>
    <p class="text-sm">{data.vermouth.recommendation}</p>
  </div>
  <div class="py-20 flex justify-center">
    <div class="max-w-4xl mx-auto">
      <img
        alt={data.vermouth.name}
        class="h-full w-auto object-cover"
        src="{data.vermouth.image}/w=400,h=400,fit=cover"
        srcset={squareSrcSet(data.vermouth.image)}
        sizes="(max-width: 500px) 100vw, (max-width: 1800px) 50vw, 896px"
        width="580"
        height="580"
      />
    </div>
  </div>
</section>

<ul class="md:grid md:grid-cols-3 border-b border-black">
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

<section class="content border-b border-black">
  <h2>Inspiration</h2>
  <p>Op dit cocktails-game med Vermouth</p>
  <a class="btn" href="/inspiration">DYK NED I VORES MANGE DRINKSOPSKRIFTER</a>
</section>
