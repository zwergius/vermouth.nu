<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { onMount } from 'svelte'

  export let scores: { sweetness: number; fruityness: number; body: number; spiciness: number }
  // Slider values
  let sweetness = 1
  let fruityness = 1
  let body = 1
  let spiciness = 1

  let element: HTMLElement
  let intersectionObserver: IntersectionObserver

  beforeNavigate(() => {
    sweetness = 1
    fruityness = 1
    body = 1
    spiciness = 1
  })

  function updateScores() {
    ;({ body, fruityness, spiciness, sweetness } = scores)
  }

  onMount(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateScores()
          }
        })
      },
      { threshold: 0.75 },
    )
    intersectionObserver.observe(element)
    return () => {
      if (intersectionObserver) intersectionObserver.unobserve(element)
    }
  })
</script>

<div bind:this={element} class="flex flex-col p-6 gap-9">
  <!-- Dryness to Sweetness Custom Slider -->
  <div class="wrapper">
    <span class="slider-label text-right">Tør</span>
    <div class="relative">
      <div class="slider-track"></div>
      <div class="slider-thumb" style="--score: {sweetness};"></div>
    </div>
    <span class="slider-label">Sød</span>
  </div>

  <!-- Bitterness to Fruity Custom Slider -->
  <div class="wrapper">
    <span class="slider-label text-right">Bitter</span>
    <div class="relative">
      <div class="slider-track"></div>
      <div class="slider-thumb" style="--score: {fruityness};"></div>
    </div>
    <span class="slider-label">Fruity</span>
  </div>

  <!-- Full-bodied to Light Custom Slider -->
  <div class="wrapper">
    <span class="slider-label text-right">Let</span>
    <div class="relative">
      <div class="slider-track"></div>
      <div class="slider-thumb" style="--score: {body};"></div>
    </div>
    <span class="slider-label">Fyldig</span>
  </div>

  <!-- Spicy to Aromatic Custom Slider -->
  <div class="wrapper">
    <span class="slider-label text-right">Aromatisk </span>
    <div class="relative">
      <div class="slider-track"></div>
      <div class="slider-thumb" style="--score: {spiciness};"></div>
    </div>
    <span class="slider-label">Krydret</span>
  </div>
</div>

<style lang="postcss">
  .wrapper {
    @apply flex justify-center items-center gap-3 [--slider-width:190px] md:[--slider-width:288px];
  }
  .slider-track {
    @apply bg-black/10 rounded-full h-4 w-[--slider-width] border-2 border-black;
  }

  .slider-thumb {
    --size: 40px;
    --score: 1;
    --transform-x: calc((var(--slider-width) - var(--size)) / 4 * (var(--score) - 1));
    @apply bg-brand-blue rounded-full h-[--size] w-[--size] absolute top-1/2 border border-black transition-transform duration-1000;
    transform: translate(var(--transform-x), -50%);
  }

  .slider-label {
    @apply text-xs flex-1;
  }
</style>
