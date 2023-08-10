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
      visuel: 'Mørkerød med ravfarvet kant og kobberglimt. Ren, lys og krystallinsk.',
      oldactory:
        'Aromaer af moden frugt, markurter, krat, vanilje og toffee. Noter af fin balsamico og krydrede nuancer.',
      mund: 'Frisk indgang med en perfekt balance mellem syre og sødme. Med et bittert og forfriskende punkt, en delikat mellemsmag og en kompleks og elegant finish.',
    },

    {
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
      visuel: 'Strågul. Ren og krystalklar.',
      oldactory: 'Frugtagtig og attraktiv duft af citrus, æble og krat eller friske grønne urter.',
      mund: 'Cremet fornemmelse med nuancer af bittert æble, kandiseret citron, grønne urter og et strejf af tropiske frugter.',
    },

    {
      brand: 'Sardino',
      name: 'Rojo',
      image: sardinoRojo,
      visuel: 'Mahognirød farve, det fremstår som en meget ren vermouth uden uklarhed.',
      oldactory:
        'Meget aromatisk og leder tankerne hen på minder om vanilje, kamille og kanel macerater.',
      mund: 'Lidt alkoholisk konnotation og en perfekt balance mellem bitterhed, sødme og syre, som et resultat opnår vi en lang eftersmag af sømandsvermouth.',
    },
    {
      brand: 'Sardino',
      name: 'Blanco',
      image: sardinoBlanco,
      visuel: 'Strågul farve.',
      oldactory: 'Friske og frugtige nuancer, meget aromatisk.',
      mund: 'Stor harmoni og balance af smag, sød og bitter med friske og frugtige nuancer, meget aromatisk og med en lang vedholdenhed på ganen.',
    },

    {
      brand: 'Carmeleta',
      name: 'Orange ',
      image: carmeletaOrange,
      visuel: 'Mørkerød med ravfarvet kant og kobberglimt. Ren, lys og krystallinsk.',
      oldactory:
        'Aromaer af moden frugt, markurter, krat, vanilje og toffee. Noter af fin balsamico og krydrede nuancer.',
      mund: 'Frisk indgang med en perfekt balance mellem syre og sødme. Med et bittert og forfriskende punkt, en delikat mellemsmag og en kompleks og elegant finish.',
    },

    {
      brand: 'Carmeleta',
      name: 'Blanco',
      image: carmeletaBlanco,
      visuel: 'Mørkerød med ravfarvet kant og kobberglimt. Ren, lys og krystallinsk.',
      oldactory:
        'Aromaer af moden frugt, markurter, krat, vanilje og toffee. Noter af fin balsamico og krydrede nuancer.',
      mund: 'Frisk indgang med en perfekt balance mellem syre og sødme. Med et bittert og forfriskende punkt, en delikat mellemsmag og en kompleks og elegant finish.',
    },

    {
      brand: 'Tabira',
      name: '-',
      image: tabira,
      visuel: 'Mørkerød med ravfarvet kant og kobberglimt. Ren, lys og krystallinsk.',
      oldactory:
        'Aromaer af moden frugt, markurter, krat, vanilje og toffee. Noter af fin balsamico og krydrede nuancer.',
      mund: 'Frisk indgang med en perfekt balance mellem syre og sødme. Med et bittert og forfriskende punkt, en delikat mellemsmag og en kompleks og elegant finish.',
    },
  ]
</script>

<section>
  <div class="container">
    {#each vermouths as { image, name, brand, visuel, oldactory, mund }, index}
      <Product {image} {name} {mund} {brand} {visuel} {oldactory} {index} />
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
