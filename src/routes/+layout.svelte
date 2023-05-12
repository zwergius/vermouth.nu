<script>
  import "../app.postcss"
  import Footer from "$lib/components/footer.svelte"
  import Header from "$lib/components/header.svelte"
</script>

<Header />
<div class="logo">
  <img src="/src/lib/assets/diagonal-logo.svg" alt="logo" />
</div>
<div class="logo-home">
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
  .logo-home {
    z-index: 10;
    width: 100%;
    top: -60px;
    left: 0;
    position: absolute;
  }

  .logo {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .logo-home {
      display: none;
    }
    .logo {
      display: block;
      z-index: 10;
      width: 100%;
      top: -35px;
      left: 0;
      position: absolute;
    }
  }
  @media only screen and (max-width: 767px) {
    .logo-home {
      display: none;
    }
    .logo {
      background-color: var(--primary);
      position: static;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
</style>
