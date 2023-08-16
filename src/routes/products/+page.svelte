<script lang="ts">
  import Product from '$lib/components/product.svelte'

  export let data
</script>

<section>
  <div class="container">
    {#each data.card as { cardImage, name, brand }, index}
      <a href="/products/{name}">
        <Product {cardImage} {brand} {index} />
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
