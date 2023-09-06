<script lang="ts">
  import { fade } from 'svelte/transition'
  import Product from '$lib/components/product-card.svelte'
  import SEO from '$lib/components/SEO.svelte'
  import { vermouths } from './data.js'
</script>

<SEO
  description="Vores udvalg af Vermouth"
  image="https://vermouth.nu/cdn/shop/files/552A24A2-C31B-4C91-A8B3-5A3C5F5EA8D3_2048x.JPG?v=1615928417"
  imageAlt="Forzudo Rojo"
  title="Produkter | Vermouth.NU"
/>

<section class="container">
  {#each vermouths as vermouth, index}
    <div in:fade={{ duration: 300, delay: index * 150 }}>
      <a href="/products/{vermouth.name.toLowerCase().replace(' ', '-')}">
        <Product {vermouth} />
      </a>
    </div>
  {/each}
</section>

<style>
  .container {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    display: grid;
    align-items: center;
    width: 100%;
    grid-gap: 35px;
    padding: 100px;
  }
  @media only screen and (max-width: 1024px) {
    .container {
      grid-gap: 40px;
      padding: 70px 40px 50px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      padding: 75px 15px 50px;
    }
  }
</style>
