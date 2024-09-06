<script lang="ts">
  import { onMount } from 'svelte'

  export let theme: 'blue' | 'red' | 'yellow' | 'white' = 'blue'
  export let text: string

  const pixelsPerSecond = 100
  let container: HTMLElement
  let marqueeText = ''

  let textWidth = 0
  // let containerWidth = 5120 // Width of an iMac 27" screen in pixels
  let repetitions = 1
  let animationDuration = 20 // Adjust to control the speed
  let resizeObserver: ResizeObserver

  // Function to calculate the width of the text in pixels
  function calculateTextWidth(text: string, font: string) {
    const tempElement = document.createElement('span')
    tempElement.style.font = font
    tempElement.style.visibility = 'hidden'
    tempElement.style.whiteSpace = 'nowrap'
    tempElement.style.position = 'absolute' // Remove from document flow
    tempElement.style.display = 'inline-block'
    tempElement.innerText = text
    document.body.appendChild(tempElement)

    const textWidth = tempElement.offsetWidth
    document.body.removeChild(tempElement)

    return textWidth
  }

  // Function to calculate the number of repetitions needed
  function calculateRepetitions(textWidth: number, targetScreenWidth: number) {
    return Math.ceil(targetScreenWidth / textWidth)
  }

  function setMarqueeText() {
    const { font } = getComputedStyle(container)
    const string = `${text.trim()}\u00A0`
    textWidth = calculateTextWidth(string, font)
    repetitions = calculateRepetitions(textWidth, container.offsetWidth)
    animationDuration = Math.ceil((textWidth * repetitions) / pixelsPerSecond)
    marqueeText = string.repeat(repetitions)
  }

  onMount(() => {
    resizeObserver = new ResizeObserver(setMarqueeText)
    resizeObserver.observe(container)

    return () => {
      if (resizeObserver && container) {
        resizeObserver.unobserve(container)
      }
    }
  })
</script>

<div
  bind:this={container}
  class="marquee"
  class:text-brand-pink={theme === 'blue' || theme === 'red'}
  class:text-brand-red={theme === 'yellow' || theme === 'white'}
  class:bg-brand-blue={theme === 'blue'}
  class:bg-brand-red={theme === 'red'}
  class:bg-brand-yellow={theme === 'yellow'}
  class:bg-white={theme === 'white'}
  style="--animation-duration: {animationDuration}s"
>
  <div class="marquee-content">
    {marqueeText}
  </div>
  <div class="marquee-content">
    {marqueeText}
  </div>
</div>

<style>
  .marquee {
    @apply flex h-[6.25rem] w-full select-none items-center overflow-hidden border-b border-black text-xl font-bold lg:h-[19.375rem] lg:text-[7.5rem];
  }

  .marquee-content {
    @apply min-w-full flex-shrink-0 whitespace-nowrap;
  }

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  /* Pause animation when reduced-motion is set */
  @media (prefers-reduced-motion: reduce) {
    .marquee-content {
      animation-play-state: paused;
    }
  }

  /* Enable animation */
  .marquee-content {
    animation-name: scroll;
    animation-duration: var(--animation-duration);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
</style>
