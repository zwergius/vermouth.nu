<script lang="ts">
  import { vermouths } from '$lib/data/products'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'

  const redVermouths = Object.values(vermouths).filter(({ color }) => color === 'RED')
  const whiteVermouths = Object.values(vermouths).filter(({ color }) => color === 'WHITE')
  const otherVermouths = Object.values(vermouths).filter(
    ({ color }) => color !== 'WHITE' && color !== 'RED',
  )
</script>

<Marquee text="VERMOUTH ER FOR ALLE //" theme="red"></Marquee>

<section class="content border-b border-black">
  <h1>VIL DU SMAGE FØR DU KØBER?</h1>
  <p>Så frygt ej! Du kan smage vores lækre dråber på et udvalg af steder i København</p>
  <a class="btn" href="/forhandlere">SE HVOR</a>
</section>

<Marquee text="ROJO // RØD //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each redVermouths as product}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="BLANCO // HVID //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each whiteVermouths as product}
    <ProductGridItem {product} />
  {/each}
</ul>

<Marquee text="ORANGE & ROSÉ //" theme="white"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each otherVermouths as product}
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
