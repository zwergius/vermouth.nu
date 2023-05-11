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
    <div class="logo">
      <img src="/src/lib/assets/logo-home.svg" alt="logo" />
    </div>

    <Carrousel {images} />
  </div>
</div>

<slot />

<style>
  img {
    object-fit: cover;
    height: 100%;
    width: auto;
  }
  .main {
    padding: 220px 100px 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .logo {
    width: 100%;
    z-index: 10;
    top: -100px;
    left: 0;
    position: absolute;
  }
  .container {
    background-color: var(--primary);
  }
  @media only screen and (max-width: 1024px) {
    .main {
      padding: 100px 50px 100px;
    }
    .logo {
      top: -35px;
      left: 0;
    }
  }
  @media only screen and (max-width: 767px) {
    .main {
      display: flex;
      margin: 0;
      flex-direction: column;
      padding: 20px 10px 80px;
    }
    .logo {
      margin-bottom: 60px;
      position: static;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
</style>
