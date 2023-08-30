<script lang="ts">
  import { fade } from 'svelte/transition'
  import Product from '$lib/components/product-card.svelte'
  import { vermouths } from './data.js'

  const productInfo = vermouths.map((vermouth) => ({
    dir: vermouth.name.toLowerCase().replace(' ', '-'),
    vermouth,
  }))
</script>

<section class="container">
  {#each productInfo as { dir, vermouth }, index}
    <div in:fade={{ duration: 300, delay: index * 150 }}>
      <a href="/products/{dir}">
        <Product {vermouth} />
      </a>
    </div>
  {/each}
</section>

<style>
  .container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    display: grid;
    align-items: center;
    width: 100%;
    grid-gap: 35px;
    padding: 100px;
  }
  @media only screen and (max-width: 1024px) {
    .container {
      grid-gap: 40px;
      padding: 50px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      padding: 50px 15px;
    }
  }
</style>
