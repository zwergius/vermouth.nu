<script>
  import '../app.postcss'
  import Footer from '$lib/components/footer.svelte'
  import Header from '$lib/components/header.svelte'
  import logoDesktop from '$lib/assets/logo-home.svg'
  import logoMobile from '$lib/assets/diagonal-logo.svg'
</script>

<div class="container">
  <Header />
  <div class="logo-mobile">
    <a href="/">
      <img src={logoMobile} alt="logo" />
    </a>
  </div>

  <div class="logo-desktop">
    <a href="/">
      <img src={logoDesktop} alt="logo" />
    </a>
  </div>
</div>
<div class="wrapper">
  <slot />
</div>

<Footer />

<style>
  .wrapper {
    display: flex;
    flex: 1;
    padding-top: 280px;
  }
  .container {
    z-index: 100;
    width: 100%;
    position: fixed;
  }
  img {
    z-index: 10;
    object-fit: cover;
    height: auto;
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
    .wrapper {
      padding-top: 370px;
    }

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
    .wrapper {
      padding-top: 200px;
    }
    .logo-desktop {
      display: none;
    }

    .logo-mobile {
      margin-bottom: 20px;
    }
  }
</style>
