<script lang="ts">
  import Card from "$lib/components/product.svelte"

  const vermouth = [
    {
      brand: "Forzudo",
      name: "Rojo",
      image: "/src/lib/assets/bottles/forzudo-rojo.avif",
    },

    {
      brand: "Forzudo",
      name: "Blanco",
      image: "/src/lib/assets/bottles/forzudo-blanco.avif",
    },

    {
      brand: "Sardino",
      name: "Rojo",
      image: "/src/lib/assets/bottles/sardino-rojo.avif",
    },
    {
      brand: "Sardino",
      name: "Blanco",
      image: "/src/lib/assets/bottles/sardino-blanco.avif",
    },

    {
      brand: "Carmeleta",
      name: "Orange ",
      image: "/src/lib/assets/bottles/orange-carmeleta.avif",
    },
    {
      brand: "Carmeleta",
      name: "Blanco",
      image: "/src/lib/assets/bottles/carmeleta-blanco.avif",
    },

    {
      brand: "Tabira",
      name: "-",
      image: "/src/lib/assets/bottles/tabira.avif",
    },

    {
      brand: "Cabecita Loca",
      name: "-",
      image: "/src/lib/assets/bottles/cabecita-loca.avif",
    },

    {
      brand: "Padro & Co",
      name: "Blanco Reserva",
      image: "/src/lib/assets/bottles/padro-blanco.avif",
    },
    {
      brand: "Padro & Co",
      name: "Dorado Amargo Suave",
      image: "/src/lib/assets/bottles/padro-dorado.avif",
    },
    {
      brand: "Padro & Co",
      name: "Blanco reserva Especial",
      image: "/src/lib/assets/bottles/padro-reserva-especial.avif",
    },

    {
      brand: "Ana Caballo",
      name: "-",
      image: "/src/lib/assets/bottles/ana-caballo.avif",
    },
  ]
</script>

<section>
  <Card {vermouth} />
</section>

<style>
  section {
    display: flex;
    padding: 100px;
  }
  @media only screen and (max-width: 1024px) {
    section {
      padding: 65px 0;
    }
  }
</style>
