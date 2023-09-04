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
    width: 100%;
    flex: 1;
    padding-top: calc((233 / 1745) * 100% + var(--padding-logo));
  }
  .container {
    z-index: 100;
    width: 100%;
    position: fixed;
  }
  img {
    object-fit: cover;
    height: auto;
    width: 100%;
  }
  .logo-desktop {
    width: 100%;
  }
  .logo-mobile {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .ringtext {
      bottom: 90px;
    }
    .logo-desktop {
      display: none;
    }
    .wrapper {
      padding-top: calc((336 / 1021) * 100%);
      padding-bottom: 30px;
    }
    .logo-mobile {
      display: block;
      z-index: 10;
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .ringtext {
      bottom: none;
      top: 73svh;
    }
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      margin-bottom: 20px;
    }
  }
</style>
