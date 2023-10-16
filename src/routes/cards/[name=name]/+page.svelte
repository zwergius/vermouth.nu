<script lang="ts">
  import { browser } from '$app/environment'
  import googleWallet from '$lib/assets/google-wallet.svg'
  import iosWallet from '$lib/assets/ios-wallet.svg'

  export let data
  const { cardData, pkpass } = data
  let isIOS: boolean
  let isAndroid: boolean
  let isMac: boolean

  if (browser) {
    const { userAgent } = navigator
    isIOS = /(iPhone|iPad|iPod)/.test(userAgent)
    isAndroid = /(Android)/.test(userAgent)
    isMac = /(Macintosh)/.test(userAgent)

    if (isIOS || isMac) {
      window.location.href = pkpass
    } else if (isAndroid) {
      window.location.href = cardData
    }
  }
</script>

<div class="container">
  <a rel="external" href={pkpass}>
    <img class="wallet-logo" src={iosWallet} alt="add the card to your wallet for ios" />
  </a>
  <a rel="external" target="_blank" href={cardData}
    ><img class="wallet-logo" src={googleWallet} alt="add the card to your wallet for android" /></a
  >
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
  .wallet-logo {
    width: 320px;
    height: auto;
  }

  @media only screen and (max-width: 1024px) {
    .container {
      flex-direction: column;
    }
    .wallet-logo {
      width: 280px;
    }
  }
  @media only screen and (max-width: 767px) {
    .wallet-logo {
      width: 200px;
    }
  }
</style>
