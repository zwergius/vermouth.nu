<script lang="ts">
  import { browser } from '$app/environment'
  import downloadIos from '$lib/assets/ios-wallet.svg'
  import downloadAndroid from '$lib/assets/google-wallet.png'

  export let data
  const { cardData, cardNameParam } = data
  let isIOS: boolean
  let isAndroid: boolean
  let isMac: boolean

  function downloadPass() {
    if (isIOS || isMac) {
      window.location.href = `${window.location.origin}/${cardNameParam}.pkpass`
    } else if (isAndroid || isMac) {
      window.location.href = cardData.passGoogle
    }
  }
  if (browser) {
    const { userAgent } = navigator

    isIOS = /(iPhone|iPad|iPod|)/.test(userAgent)
    isAndroid = /(Android)/.test(userAgent)
    isMac = /(Macintosh)/.test(userAgent)

    downloadPass()
  }
</script>

<div class="add-wallet">
  {#if typeof window !== 'undefined'}
    <a href="{window.location.origin}/{cardNameParam}.pkpass">
      <img src={downloadIos} alt="download" />
    </a>
  {/if}

  <a href={cardData.passGoogle}>
    <img src={downloadAndroid} alt="download" />
  </a>
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
</style>
