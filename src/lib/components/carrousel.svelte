<script lang="ts">
  import { browser } from '$app/environment'
  import { fade } from 'svelte/transition'
  type CarrouselImage = {
    id: string
    path: string
  }
  let index = 0
  let interval: number
  let ms = 3500
  export let images: CarrouselImage[]

  const next = () => {
    index = (index + images.length + 1) % images.length
  }
  function previous() {
    index = (index + images.length - 1) % images.length
  }

  $: if (browser) {
    clearInterval(interval)
    interval = window.setInterval(next, ms)
  }
</script>

<div class="carrousel">
  {#each [images[index]] as { id, path } (index)}
    <div class="image-container">
      <img transition:fade|local sizes="80vw" srcset={path} {id} src={path} alt={id} />
    </div>
  {/each}
  <slot {index} />
  {#if images.length}
    <button class="left" on:click={previous}> <span>&#10170;</span> </button>
    <button class="right" on:click={next}> <span>&#10170;</span> </button>
  {/if}
  <ul>
    {#each [...Array(images.length).keys()] as i}
      <button
        aria-controls={index === i ? 'carousel' : undefined}
        class="carousel-indicator"
        on:click={() => {
          index = i
        }}
      >
        <div class="circle-border">
          <svg width="13" height="13">
            <circle cx="10" cy="10" r="15" />
          </svg>
        </div>
      </button>
    {/each}
  </ul>
</div>

<style>
  .carrousel {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .image-container {
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    padding-bottom: 50px;
  }
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  button.left,
  button.right {
    color: var(--interactive-button);
    font-size: var(--55px);
    position: absolute;
    z-index: 100;
    top: 40%;
  }
  button.left {
    transform: rotateY(180deg);
    left: -30px;
  }
  span {
    padding: 0;
    margin: 0;
  }
  button.right {
    right: -30px;
  }
  ul {
    bottom: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
  }
  .carousel-indicator[aria-controls] circle {
    fill: var(--interactive-button);
  }
  .circle-border {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 2px solid var(--interactive-button);
    border-radius: 50%;
  }
  svg {
    bottom: 0;
    border: 2px solid var(--interactive-button);
    border-radius: 50%;
  }
  circle {
    fill: transparent;
    transition: fill 0.1s linear;
  }
  @media only screen and (max-width: 1024px) {
    .carrousel {
      padding-bottom: 0;
      padding: 30px;
    }
    button.left,
    button.right {
      display: none;
    }
  }
  @media only screen and (max-width: 767px) {
    .carrousel {
      padding: 0;
    }
  }
  @media (hover: hover) {
    .carousel-indicator:hover circle {
      fill: var(--interactive-button);
    }
  }
</style>
