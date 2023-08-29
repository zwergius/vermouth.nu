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
      <div in:fade={{ duration: 300, delay: index * 150 }}>
        <a href="/products/{dir}">
          <Product {image} {name} />
        </a>
      </div>
    {/each}
  </div>
</section>

<style>
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
