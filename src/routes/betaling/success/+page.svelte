<script lang="ts">
  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()
</script>

{#await data.completed}
  <section class="copy flex justify-center items-center my-auto">
    <div class="text-center flex flex-col gap-6">
      <div class="text-lg font-bold">Bekræfter din ordre...</div>
      <div class="text-sm opacity-80">Vent venligst</div>
    </div>
  </section>
{:then}
  <section class="copy flex justify-center items-center my-auto">
    <div class="text-center flex flex-col gap-6">
      <h1 class="text-2xl">TAK for din handel!</h1>
      <p class="">Du modtager en email med faktura og leveringsdetaljer.</p>
      <p>På gensyn snart :)</p>
    </div>
  </section>
{:catch}
  <section class="copy flex justify-center items-center my-auto">
    <div class="text-center flex flex-col gap-6">
      <h1 class="text-2xl">Hovsa!</h1>
      <p>Vi kunne ikke bekræfte din ordre.</p>
      <p>Kontakt os venligst👇👇</p>
    </div>
  </section>
{/await}
