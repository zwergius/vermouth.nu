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
    flex: 1;
    margin: auto 0;
    width: 100%;
    padding: 30px 100px;
  }

  @media only screen and (max-width: 1024px) {
    .main {
      padding: 0px 50px 100px;
    }
  }
  @media only screen and (max-width: 767px) {
    .main {
      margin: 0;
      padding: 20px 10px 80px;
    }
  }
</style>
