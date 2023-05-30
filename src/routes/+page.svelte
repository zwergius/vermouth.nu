<script lang="ts">
  import Carrousel from '$lib/components/carrousel.svelte'
  import forzudo from '$lib/assets/forzudo.webp'
  import banner from '$lib/assets/banner.webp'
  import tabira from '$lib/assets/tabira.webp'

  const images = [
    {
      path: forzudo,
      id: 'image1',
      alt: '',
    },
    {
      path: banner,
      id: 'image2',
      alt: '',
    },
    {
      path: tabira,
      id: 'image3',
      alt: '',
    },
  ]
</script>

<div class="main">
  <Carrousel {images} />
</div>

<slot />

<style>
  .main {
    padding: 0 100px 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  @media only screen and (max-width: 1024px) {
    .main {
      padding: 0px 50px 100px;
    }
  }
  @media only screen and (max-width: 767px) {
    .main {
      display: flex;
      margin: 0;
      flex-direction: column;
      padding: 0px 10px 80px;
    }
  }
</style>
