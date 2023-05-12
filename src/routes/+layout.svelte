<script>
  import "../app.postcss"
  import Footer from "$lib/components/footer.svelte"
  import Header from "$lib/components/header.svelte"
</script>

<Header />
<div class="logo-mobile">
  <img src="/src/lib/assets/diagonal-logo.svg" alt="logo" />
</div>
<div class="logo-desktop">
  <img src="/src/lib/assets/logo-home.svg" alt="logo" />
</div>
<slot />

<Footer />

<style>
  img {
    z-index: 10;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  .logo-desktop {
    width: 100%;
    z-index: 10;
  }

  .logo-mobile {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      display: block;
      z-index: 10;
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      position: static;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
</style>
