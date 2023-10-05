<script lang="ts">
  import { browser } from '$app/environment'
  import { redirect } from '@sveltejs/kit'

  import downloadIos from '$lib/assets/apple-wallet.png'
  import downloadAndroid from '$lib/assets/google-wallet.png'

  export let data
  const { cardData, cardNameParam } = data
  let isIOS: boolean
  let isSafari: boolean
  let isAndroid: boolean

  const oldUrl = `https://www.vermouth.nu/${cardNameParam}-vermouth-nu.pkpass`

  function downloadPass() {
    if (isIOS && isSafari) {
      if (oldUrl) {
        redirect(301, `${window.location.origin}/${cardNameParam}-vermouth-nu.pkpass`)
      }
      window.location.href = `${window.location.origin}/${cardNameParam}-vermouth-nu.pkpass`
    } else if (isAndroid) {
      if (oldUrl) {
        redirect(301, cardData.passGoogle)
      }
      window.location.href = cardData.passGoogle
    }
  }

  if (browser) {
    const { userAgent } = navigator
    isIOS = /(iPhone|iPad|iPod)/.test(userAgent)
    isSafari = /Safari/.test(userAgent)
    isAndroid = /(Android)/.test(userAgent)
    downloadPass()
  }
</script>

<div class="download">
  <button on:click={downloadPass}>
    <img src={downloadIos} alt="download" />
  </button>

  <button on:click={downloadPass}>
    <img src={downloadAndroid} alt="download" />
  </button>
</div>

<style>
  .download {
    flex-direction: column;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
