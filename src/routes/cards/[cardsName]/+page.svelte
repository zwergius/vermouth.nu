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

<div class="add-wallet">
  <a href={pkpass}><img class="image-button" src={iosWallet} alt="button" /></a>
  <a href={cardData.passGoogle}><img class="image-button" src={googleWallet} alt="button" /></a>
</div>

<style>
  .add-wallet {
    padding-top: 50px;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-button {
    width: 400px;
    height: auto;
  }

  @media only screen and (max-width: 1024px) {
    .add-wallet {
      flex-direction: column;
    }
    .image-button {
      width: 300px;
    }
  }
  @media only screen and (max-width: 767px) {
    .image-button {
      width: 200px;
    }
  }
</style>
