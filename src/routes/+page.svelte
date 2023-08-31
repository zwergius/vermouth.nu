<script lang="ts">
  import banner from '$lib/assets/banner.webp'
  import Carrousel from '$lib/components/carrousel.svelte'
  import forzudo from '$lib/assets/forzudo.webp'
  import SEO from '$lib/components/SEO.svelte'
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

<SEO
  description="Vermouth distributør"
  image="$lib/assets/forzudo.webp"
  imageAlt="Vermouth.NU"
  title="Vermouth.NU"
/>

<div class="main">
  <Carrousel {images} />
</div>

<slot />

<style>
  .main {
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
