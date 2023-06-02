<script>
  import '../app.postcss'
  import Footer from '$lib/components/footer.svelte'
  import Header from '$lib/components/header.svelte'
  import logoDesktop from '$lib/assets/logo-home.svg'
  import logoMobile from '$lib/assets/diagonal-logo.svg'
</script>

<Header />
<div class="container">
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
<div class="box">
  <slot />
</div>
<Footer />

<style>
  .box {
    margin: auto 0;
  }

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
      margin-bottom: 20px;
    }
  }
</style>
