<script>
  import '../app.postcss'
  import Footer from '$lib/components/footer.svelte'
  import Header from '$lib/components/header.svelte'
  import logoDesktop from '$lib/assets/logo-home.svg'
  import logoMobile from '$lib/assets/diagonal-logo.svg'
  import RingText from '$lib/components/ring-text.svelte'
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
  <div class="ringtext">
    <RingText />
  </div>
</div>
<Footer />

<style>
  .ringtext {
    position: fixed;
    right: 5px;
    bottom: 67px;
  }
  .wrapper {
    display: flex;
    flex: 1;
    padding-top: 260px;
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
    background-image: linear-gradient(#f0a9a8 90%, #9e9e9f00 100%);
    width: 100%;
    z-index: 10;
    padding-bottom: 30px;
  }

  .logo-mobile {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .ringtext {
      bottom: 90px;
    }
    .wrapper {
      padding-top: 370px;
    }
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      background-image: linear-gradient(#f0a9a8 90%, #9e9e9f00 100%);
      display: block;
      z-index: 10;
      width: 100%;
      padding-bottom: 20px;
    }
  }
  @media only screen and (max-width: 767px) {
    .ringtext {
      top: 66svh;
    }
    .wrapper {
      padding-top: 200px;
    }
    .logo-desktop {
      display: none;
    }
  }
</style>
