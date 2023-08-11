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
    {
      brand: 'Forzudo',
      name: 'Rojo',
      image: forzudoRojo,
      region: 'Bierzo, Leon, Nordvest',
      size: '100 cl. / 15%',
    },
    {
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
      region: 'Bierzo, Leon, Nordvest',
      size: '100 cl. / 15%',
    },

    {
      brand: 'Sardino',
      name: 'Rojo',
      image: sardinoRojo,
      region: 'Galicien, Nordvestkysten',
      size: '75 cl. / 15%',
    },
    {
      brand: 'Sardino',
      name: 'Blanco',
      image: sardinoBlanco,
      region: 'Galicien, Nordvestkysten',
      size: '75 cl. / 15%',
    },

    {
      brand: 'Carmeleta',
      name: 'Orange ',
      image: carmeletaOrange,
      region: 'L’Alquería de la Comtessa, Valencia',
      size: '75 cl. / 15%',
    },

    {
      brand: 'Carmeleta',
      name: 'Blanco',
      image: carmeletaBlanco,
      region: 'L’Alquería de la Comtessa, Valencia',
      size: '75 cl. / 15%',
    },

    {
      brand: 'Tabira',
      name: '',
      image: tabira,
      region: 'Leon, Nordvest',
      size: '100 cl. / 15%',
    },
  ]
</script>

<section>
  <div class="container">
    {#each vermouths as { image, name, brand, region, size }, index}
      <Product {image} {name} {size} {brand} {region} {index} />
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
