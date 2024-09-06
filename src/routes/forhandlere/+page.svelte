<script lang="ts">
  import Marquee from '$lib/components/marquee.svelte'
  import locations from '$lib/data/locations'
</script>

<Marquee text="FYSISKE FORHANDLERE //" theme="red"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each locations.physicalShops as { name, location }}
    <li class="grid-item flex">
      <div class="m-auto">
        <h2 class="">{name}</h2>
        <p>{location}</p>
      </div>
    </li>
  {/each}
</ul>

<Marquee text="WEBSHOPS //" theme="yellow"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each locations.onlineShops as { name, location }}
    <li class="grid-item flex">
      <div class="m-auto">
        <h2>{name}</h2>
        <p>{location}</p>
      </div>
    </li>
  {/each}
</ul>

<Marquee text="SMAG HER //" theme="blue"></Marquee>

<ul class="grid-layout border-b border-black">
  {#each locations.barsRestaurants as { name, location }}
    <li class="grid-item flex">
      <div class="m-auto">
        <h2>{name}</h2>
        <p>{location}</p>
      </div>
    </li>
  {/each}
</ul>

<section class="content border-b border-black">
  <h2>VIDSTE DU AT VI TILBYDER</h2>
  <p>
    Vermouth smagninger til både private og firmaer. Den helt rigtige måde at komme igang med
    vermouth på.
  </p>
  <a class="btn" href="mailto:info@vermouth.nu">BOOK EN SMAGNING</a>
</section>

<style>
  .grid-item h2 {
    @apply text-lg text-brand-blue text-center mb-11;
  }
  .grid-item p {
    @apply text-sm;
  }
</style>
