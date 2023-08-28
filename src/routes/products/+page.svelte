<script lang="ts">
  import Product from '$lib/components/product-card.svelte'
  import { vermouths } from './data.js'

  const productInfo = vermouths.map((vermouth) => ({
    dir: vermouth.name.toLocaleLowerCase().replace(' ', '-'),
    image: vermouth.cardImage,
    name: vermouth.name,
  }))
</script>

<section>
  <div class="container">
    {#each productInfo as { image, dir, name }, index}
      <a href="/products/{dir}">
        <Product {image} {name} {index} />
      </a>
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
