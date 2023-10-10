<script lang="ts">
  import { browser } from '$app/environment'
  import downloadIos from '$lib/assets/ios-wallet.svg'
  import downloadIosBig from '$lib/assets/ios-wallet-b.svg'
  import downloadIosMediun from '$lib/assets/ios-wallet-m.svg'
  import downloadAndroid from '$lib/assets/google-wallet.svg'
  import downloadAndroidBig from '$lib/assets/google-wallet-b.svg'
  import downloadAndroidMediun from '$lib/assets/google-wallet-m.svg'
  import LinkWallet from '$lib/components/link-wallet.svelte'

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
  <LinkWallet href={pkpass} src={downloadIos} alt="ios" />
  <LinkWallet href={cardData.passGoogle} src={downloadAndroid} alt="android" />
</div>
<div class="add-wallet tablet">
  <LinkWallet href={pkpass} src={downloadIosMediun} alt="ios" />
  <LinkWallet href={cardData.passGoogle} src={downloadAndroidMediun} alt="android" />
</div>
<div class="add-wallet desktop">
  <LinkWallet href={pkpass} src={downloadIosBig} alt="ios" />
  <LinkWallet href={cardData.passGoogle} src={downloadAndroidBig} alt="android" />
</div>

<style>
  .add-wallet {
    flex-direction: column;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tablet {
    display: none;
  }
  .mobile {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .desktop {
      display: none;
    }
    .tablet {
      display: flex;
    }
    .mobile {
      display: none;
    }
  }
  @media only screen and (max-width: 767px) {
    .mobile {
      display: flex;
    }
    .desktop {
      display: none;
    }
    .tablet {
      display: none;
    }
  }
</style>
