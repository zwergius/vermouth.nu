<script lang="ts">
  import { fade } from 'svelte/transition'
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
      sizeAndDegrees: '100 cl. / 15%',
    },
    {
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
      region: 'Bierzo, Leon, Nordvest',
      sizeAndDegrees: '100 cl. / 15%',
    },
    {
      brand: 'Sardino',
      name: 'Rojo',
      image: sardinoRojo,
      region: 'Galicien, Nordvestkysten',
      sizeAndDegrees: '75 cl. / 15%',
    },
    {
      brand: 'Sardino',
      name: 'Blanco',
      image: sardinoBlanco,
      region: 'Galicien, Nordvestkysten',
      sizeAndDegrees: '75 cl. / 15%',
    },
    {
      brand: 'Carmeleta',
      name: 'Orange ',
      image: carmeletaOrange,
      region: 'L’Alquería de la Comtessa, Valencia',
      sizeAndDegrees: '75 cl. / 15%',
    },
    {
      brand: 'Carmeleta',
      name: 'Blanco',
      image: carmeletaBlanco,
      region: 'L’Alquería de la Comtessa, Valencia',
      sizeAndDegrees: '75 cl. / 15%',
    },
    {
      brand: 'Tabira',
      name: '',
      image: tabira,
      region: 'Leon, Nordvest',
      sizeAndDegrees: '100 cl. / 15%',
    },
  ]
</script>

<section class="container">
  {#each vermouths as { image, name, brand, region, sizeAndDegrees }, index}
    <div in:fade={{ duration: 300, delay: index * 150 }} class="card">
      <Product {image} {name} {sizeAndDegrees} {brand} {region} />
    </div>
  {/each}
</section>

<style>
  .card {
    overflow: hidden;
    position: relative;
    border: 2px solid var(--secondary);
    border-radius: 20px;
    padding-bottom: 50px;
  }
  .container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    display: grid;
    align-items: center;
    width: 100%;
    grid-gap: 50px;
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
