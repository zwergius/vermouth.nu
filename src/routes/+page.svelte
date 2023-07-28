<script lang="ts">
  import Carrousel from '$lib/components/carrousel.svelte'
  import forzudo from '$lib/assets/forzudo.webp'
  import banner from '$lib/assets/banner.webp'
  import tabira from '$lib/assets/tabira.webp'
  import RingText from '$lib/components/ring-text.svelte'

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
  <div class="ringtext">
    <RingText />
  </div>
</div>

<slot />

<style>
  .ringtext {
    position: fixed;
    right: 20px;
    bottom: 150px;
  }
  .main {
    position: relative;
    flex: 1;
    margin: auto 0;
    width: 100%;
    padding: 0 100px 30px;
  }

  @media only screen and (max-width: 1024px) {
    .main {
      padding: 0px 50px 100px;
    }
  }
  @media only screen and (max-width: 767px) {
    .main {
      margin: 0;
      padding: 0px 10px 80px;
    }
  }
</style>
