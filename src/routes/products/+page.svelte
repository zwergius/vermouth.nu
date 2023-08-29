<script lang="ts">
  import { fade } from 'svelte/transition'

  import Product from '$lib/components/product-card.svelte'
  import { vermouths } from './data.js'

  const productInfo = vermouths.map((vermouth) => ({
    dir: vermouth.name.toLowerCase().replace(' ', '-'),
    image: vermouth.cardImage,
    name: vermouth.name,
  }))
</script>

<section>
  <div class="container">
    {#each productInfo as { image, dir, name }, index}
      <div in:fade={{ duration: 300, delay: index * 150 }} class="product">
        <a href="/products/{dir}">
          <Product {image} {name} />
        </a>
      </div>
    {/each}
  </div>
</section>

<style>
  .product {
    border: 2px solid var(--secondary);
    border-radius: 20px;
    transition: transform 0.2s ease-in-out;
  }
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
  }
  section {
    padding: 100px;
  }
  @media only screen and (max-width: 1024px) {
    section {
      padding: 50px 0 60px 0;
    }
  }
</style>
