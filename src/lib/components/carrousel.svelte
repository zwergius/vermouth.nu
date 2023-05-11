<script lang="ts">
  import { browser } from "$app/environment"
  import { fade } from "svelte/transition"
  type ImageType = {
    id: string
    path: string
  }
  let index = 0
  let interval: number
  export let images: ImageType[]

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

<div class="carrousel">
  {#if images.length}
    {#each [images[index]] as { id, path } (index)}
      <div class="image">
        <img
          transition:fade
          width="1700px"
          height="600px"
          {id}
          src={path}
          alt={id}
        />
      </div>
    {/each}
  {/if}
  <slot {index} />
  {#if images.length > 0}
    <button class="left" on:click={previous}><span>&#8592;</span> </button>
    <button class="right" on:click={next}> <span>&#8594;</span> </button>
    <ul>
      {#each [...Array(images.length).keys()] as i}
        <button
          aria-controls={index === i ? "carousel" : undefined}
          class="carousel-indicator"
          on:click={() => {
            index = i
          }}
        >
          <svg width="35" height="20">
            <circle cx="10" cy="10" r="10" />
          </svg>
        </button>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .carrousel {
    position: relative;
    width: 100%;
    aspect-ratio: 16/7;
  }
  .image {
    position: absolute;
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
    top: 50%;
    transform: translateY(-50%);
  }
  button.left {
    padding: 20px 30px 20px 0;
    left: -45px;
  }

  button.right {
    right: -45px;
    padding: 20px 0px 20px 30px;
  }
  ul {
    padding-top: 10px;
    position: absolute;
    left: 100px;
    bottom: -50px;
    transform: translateX(-50%);
    display: flex;
  }

  .carousel-indicator {
    padding: 5px 10px;
  }

  .carousel-indicator[aria-controls] circle {
    fill: var(--secondary);
  }

  circle {
    fill: var(--grey);
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

    button.left,
    button.right {
      display: none;
    }
    ul {
      top: 100%;
      left: 50%;
    }
  }
  @media only screen and (max-width: 767px) {
    .image {
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
