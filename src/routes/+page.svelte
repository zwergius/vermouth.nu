<script lang="ts">
  import Header from "$lib/components/header.svelte"
  import Carrousel from "$lib/components/carrousel.svelte"
  const images = [
    {
      path: "/src/lib/assets/forzudo.webp",
      id: "image1",
      alt: "",
    },
    {
      path: "/src/lib/assets/banner.webp",
      id: "image2",
      alt: "",
    },
    {
      path: "/src/lib/assets/tabira.webp",
      id: "image3",
      alt: "",
    },
  ]
</script>

<div class="container">
  <Header />
  <div class="main">
    <div class="box-logo">
      <div class="logo">
        <img
          width="1200"
          height="350"
          src="/src/lib/assets/logo-home.png"
          alt="logo"
        />
      </div>
    </div>

    <Carrousel {images} />
  </div>
</div>

<slot />

<style>
  .main {
    margin-top: 120px;
    padding-bottom: 50px;
    display: flex;
    justify-content: center;
  }
  .logo {
    height: 400px;
    z-index: 10;
    top: 0;
    position: absolute;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .container {
    background-color: var(--primary);
  }
  @media only screen and (max-width: 1024px) {
    img {
      aspect-ratio: 8/4;
    }
  }
</style>
