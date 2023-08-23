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
    <div class="wrap">
      <Product {image} {name} {sizeAndDegrees} {brand} {region} {index} />
    </div>
  {/each}
</section>

<style>
  .wrap {
    width: 24%;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 100px;
  }
  @media only screen and (max-width: 1024px) {
    .wrap {
      width: 47%;
    }
    .container {
      gap: 40px;
      padding: 50px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      padding: 50px 15px;
    }
    .wrap {
      width: 100%;
    }
  }
</style>
