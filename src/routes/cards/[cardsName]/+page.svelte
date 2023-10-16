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
      window.location.href = cardData.passGoogle
    }
  }
</script>

<div class="container-links">
  <a rel="external" href={pkpass}
    ><img class="logo-wallet" src={iosWallet} alt="add the card to your wallet for ios" /></a
  >
  <a rel="external" href={cardData.passGoogle}
    ><img class="logo-wallet" src={googleWallet} alt="add the card to your wallet for android" /></a
  >
</div>

<style>
  .container-links {
    padding-top: 50px;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo-wallet {
    width: 320px;
    height: auto;
  }

  @media only screen and (max-width: 1024px) {
    .container-links {
      flex-direction: column;
    }
    .logo-wallet {
      width: 280px;
    }
  }
  @media only screen and (max-width: 767px) {
    .logo-wallet {
      width: 200px;
    }
  }
</style>
