<script lang="ts">
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import download from '$lib/assets/icons8-descargas-96.png'

  export let data
  const { cardData, cardNameParam } = data
  let isIOS: boolean
  let isSafari: boolean
  let isAndroid: boolean
  let pkpass: string
  let googlePassUrl: string
  let baseUrl = ``

  onMount(() => (baseUrl = window.location.origin))

  pkpass = `${baseUrl}/${cardNameParam}-vermouth-nu.pkpass`
  googlePassUrl = cardData.passGoogle

  function downloadPass() {
    if (isIOS && isSafari) {
      window.location.href = pkpass
    } else if (isAndroid) {
      window.location.href = googlePassUrl
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
  <button on:click={downloadPass}><img src={download} alt="download" /></button>
</div>

<style>
  .download {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
