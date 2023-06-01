<script lang="ts">
  import { browser } from '$app/environment'
  import { fade } from 'svelte/transition'
  type CarrouselImage = {
    id: string
    path: string
  }
  let index = 0
  let interval: number
  export let images: CarrouselImage[]

  const next = () => {
    index = (index + images.length + 1) % images.length
  }
  function previous() {
    index = (index + images.length - 1) % images.length
  }

  let ms = 3500
  $: if (browser) {
    clearInterval(interval)
    interval = window.setInterval(next, ms)
  }
</script>

<div class="container">
  <div class="carrousel">
    {#if images.length}
      {#each [images[index]] as { id, path } (index)}
        <div class="image">
          <img transition:fade sizes="80vw" srcset="{path}, 1200w" {id} src={path} alt={id} />
        </div>
      {/each}
    {/if}
    <slot {index} />
    {#if images.length > 0}
      <button class="left" on:click={previous}> <span>&#10170;</span> </button>
      <button class="right" on:click={next}> <span>&#10170;</span> </button>
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
              <svg width="18" height="18">
                <circle cx="7" cy="7" r="7" />
              </svg>
            </div>
          </button>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .container {
    position: relative;
    width: 100%;
    aspect-ratio: 16/7;
  }

  .image {
    z-index: -1;
    position: absolute;
    bottom: 50px;
    aspect-ratio: 16/7;
    width: 100%;
  }
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  button.left,
  button.right {
    color: var(--secondary);
    font-size: 100px;
    position: absolute;
    z-index: 100;
    top: 30%;
  }
  button.left {
    transform: rotateY(180deg);
    left: -45px;
  }
  span {
    padding: 0;
    margin: 0;
  }

  button.right {
    right: -45px;
  }
  ul {
    position: absolute;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
  }

  .carousel-indicator[aria-controls] circle {
    fill: var(--secondary);
  }
  .circle-border {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 2px solid var(--secondary);
    border-radius: 50%;
  }
  svg {
    border: 2px solid var(--secondary);
    border-radius: 50%;
  }

  circle {
    fill: transparent;
    transition: fill 0.1s linear;
  }
  @media only screen and (max-width: 1024px) {
    .image {
      aspect-ratio: 4/3;
    }

    .carrousel {
      display: flex;
      justify-content: center;
      aspect-ratio: 4/3;
    }
    ul {
      bottom: 75px;
    }

    button.left,
    button.right {
      display: none;
    }
  }
  @media only screen and (max-width: 767px) {
    ul {
      bottom: 30px;
    }
    .image {
      bottom: 0;
      aspect-ratio: 1/1;
    }
    .carrousel {
      aspect-ratio: 1/1;
    }
  }
  @media (hover: hover) {
    .carousel-indicator:hover circle {
      fill: var(--secondary);
    }
  }
</style>
