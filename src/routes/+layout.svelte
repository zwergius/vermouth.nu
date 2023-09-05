<script>
  import '../app.postcss'
  import { page } from '$app/stores'
  import Footer from '$lib/components/footer.svelte'
  import Header from '$lib/components/header.svelte'
  import logoDesktop from '$lib/assets/logo-home.svg'
  import logoMobile from '$lib/assets/diagonal-logo.svg'
  import RingText from '$lib/components/ring-text.svelte'

  const desiredUrl = '/'

  $: hasgradient = $page.url.pathname === desiredUrl
</script>

<div class="container">
  <Header />
  <div class={hasgradient ? 'logo-desktop' : 'logo-desktop gradient'}>
    <a href="/">
      <img src={logoDesktop} alt="logo" />
    </a>
  </div>
  <div class={hasgradient ? 'logo-mobile' : 'logo-mobile gradient'}>
    <a href="/">
      <img src={logoMobile} alt="logo" />
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
    --padding-logo: 10px;
    --logo-aspect-ratio: 233 / 1745;
    display: flex;
    width: 100%;
    flex: 1;
    padding-top: calc(var(--logo-aspect-ratio) * 100vw + var(--padding-logo));
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
  .gradient {
    background-image: linear-gradient(#f0a9a8 75%, #9e9e9f00 100%);
  }
  .logo-desktop {
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
    .logo-desktop {
      display: none;
    }
    .wrapper {
      --logo-aspect-ratio: 336 / 1021;
      padding-bottom: 30px;
    }
    .logo-mobile {
      display: block;
      z-index: 10;
      width: 100%;
      padding-bottom: 20px;
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
