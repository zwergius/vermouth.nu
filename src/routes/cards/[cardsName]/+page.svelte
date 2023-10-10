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

<div class="add-wallet mobile">
  <div class="ios">
    <a href={pkpass}><img src={iosWallet} alt="button" /></a>
  </div>
  <div class="android">
    <a href={cardData.passGoogle}><img src={googleWallet} alt="button" /></a>
  </div>
</div>

<style>
  .add-wallet {
    padding-top: 50px;
    flex-direction: column;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .android {
    width: 400px;
    height: 111px;
  }
  .ios {
    width: 400px;
    height: 127px;
  }
  @media only screen and (max-width: 1024px) {
    .android {
      width: 300px;
      height: 83px;
    }
    .ios {
      width: 300px;
      height: 95px;
    }
  }
  @media only screen and (max-width: 767px) {
    .android {
      width: 200px;
      height: 55px;
    }
    .ios {
      width: 200px;
      height: 63px;
    }
  }
</style>
