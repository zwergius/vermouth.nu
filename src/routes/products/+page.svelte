<script lang="ts">
  import Product from '$lib/components/product.svelte'
  import sardinoBlanco from '$lib/assets/bottles/sardino-blanco.avif'
  import sardinoRojo from '$lib/assets/bottles/sardino-rojo.avif'
  import forzudoRojo from '$lib/assets/bottles/forzudo-rojo.avif'
  import forzudoBlanco from '$lib/assets/bottles/forzudo-blanco.avif'
  import carmeletaOrange from '$lib/assets/bottles/orange-carmeleta.avif'
  import carmeletaBlanco from '$lib/assets/bottles/carmeleta-blanco.avif'
  import tabira from '$lib/assets/bottles/tabira.avif'

  const vermouths = [
    { id: 1, brand: 'Forzudo', name: 'Rojo', image: forzudoRojo },

    {
      id: 2,
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
    },

    { id: 3, brand: 'Sardino', name: 'Rojo', image: sardinoRojo },
    { id: 4, brand: 'Sardino', name: 'Blanco', image: sardinoBlanco },

    { id: 5, brand: 'Carmeleta', name: 'Orange ', image: carmeletaOrange },
    { id: 6, brand: 'Carmeleta', name: 'Blanco', image: carmeletaBlanco },

    {
      id: 7,
      brand: 'Tabira',
      name: '-',
      image: tabira,
    },
  ]
</script>

<section>
  <div class="container">
    {#each vermouths as { image, name, brand }, index}
      <Product {image} {name} {brand} {index} />
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
