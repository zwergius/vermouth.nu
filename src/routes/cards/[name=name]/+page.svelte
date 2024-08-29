<script lang="ts">
  import { browser } from '$app/environment'
  import GoogleWalletIcon from '$lib/components/google-wallet.svelte'
  import IosWalletIcon from '$lib/components/ios-wallet-icon.svelte'

  export let data
  const { cardData, pkpass } = data

  if (browser) {
    const { userAgent } = navigator
    const isIOS = /(iPhone|iPad|iPod)/.test(userAgent)
    const isAndroid = /(Android)/.test(userAgent)
    const isMac = /(Macintosh)/.test(userAgent)

    if (isIOS || isMac) {
      window.location.href = pkpass
    } else if (isAndroid) {
      window.location.href = cardData
    }
  }
</script>

<div class="container">
  <a rel="external" href={pkpass}>
    <IosWalletIcon />
  </a>
  <a rel="external" target="_blank" href={cardData}>
    <GoogleWalletIcon />
  </a>
</div>

<style>
  .container {
    padding-top: 50px;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a :global(svg) {
    width: 320px;
    height: auto;
  }

  @media only screen and (max-width: 1024px) {
    .container {
      flex-direction: column;
    }
    a :global(svg) {
      width: 280px;
    }
  }
  @media only screen and (max-width: 767px) {
    a :global(svg) {
      width: 200px;
    }
  }
</style>
