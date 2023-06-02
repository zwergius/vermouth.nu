<script lang="ts">
  import Product from '$lib/components/product.svelte'
  import sardinoBlanco from '$lib/assets/bottles/sardino-blanco.avif'
  import sardinoRojo from '$lib/assets/bottles/sardino-rojo.avif'
  import forzudoRojo from '$lib/assets/bottles/forzudo-rojo.avif'
  import forzudoBlanco from '$lib/assets/bottles/forzudo-blanco.avif'
  import carmeletaOrange from '$lib/assets/bottles/orange-carmeleta.avif'
  import carmeletaBlanco from '$lib/assets/bottles/carmeleta-blanco.avif'
  import tabira from '$lib/assets/bottles/tabira.avif'
  import cabecitaLoca from '$lib/assets/bottles/cabecita-loca.avif'
  import padroBlanco from '$lib/assets/bottles/padro-blanco.avif'
  import padroDorado from '$lib/assets/bottles/padro-dorado.avif'
  import padroEspecial from '$lib/assets/bottles/padro-reserva-especial.avif'
  import anaCaballo from '$lib/assets/bottles/ana-caballo.avif'

  const vermouths = [
    {
      brand: 'Forzudo',
      name: 'Rojo',
      image: forzudoRojo,
    },

    {
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
    },

    {
      brand: 'Sardino',
      name: 'Rojo',
      image: sardinoRojo,
    },
    {
      brand: 'Sardino',
      name: 'Blanco',
      image: sardinoBlanco,
    },

    {
      brand: 'Carmeleta',
      name: 'Orange ',
      image: carmeletaOrange,
    },
    {
      brand: 'Carmeleta',
      name: 'Blanco',
      image: carmeletaBlanco,
    },

    {
      brand: 'Tabira',
      name: '-',
      image: tabira,
    },

    {
      brand: 'Cabecita Loca',
      name: '-',
      image: cabecitaLoca,
    },

    {
      brand: 'Padro & Co',
      name: 'Blanco Reserva',
      image: padroBlanco,
    },
    {
      brand: 'Padro & Co',
      name: 'Dorado Amargo Suave',
      image: padroDorado,
    },
    {
      brand: 'Padro & Co',
      name: 'Blanco reserva Especial',
      image: padroEspecial,
    },

    {
      brand: 'Ana Caballo',
      name: '-',
      image: anaCaballo,
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
      padding: 0;
    }
  }
</style>
