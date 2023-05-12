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
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  .logo-desktop {
    z-index: 10;
    width: 100%;
    top: -60px;
    left: 0;
    position: absolute;
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
      top: -35px;
      left: 0;
      position: absolute;
    }
  }
  @media only screen and (max-width: 767px) {
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      background-color: var(--primary);
      position: static;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
</style>
