<script lang="ts">
  import { browser } from "$app/environment"
  type ImageType = {
    id: string
    path: string
  }
  let index = 0
  let interval: number
  export let images: ImageType[]
  const next = () => {
    index = (index + 1) % images.length
  }
  function previous() {
    index = (index + length - 1) % images.length
  }

  let ms = 3500
  $: if (browser) {
    clearInterval(interval)
    interval = window.setInterval(next, ms)
  }
</script>

<div>
  {#if images.length}
    {#each [images[index]] as { id, path } (index)}
      <img width="1200" height="600" {id} src={path} alt={id} />
    {/each}
  {/if}
  <slot {index} />
  {#if images.length > 0}
    <button class="left" on:click={previous}><span>&#60;</span> </button>
    <button class="right" on:click={next}> <span>&#62;</span> </button>
    <ul>
      {#each [...Array(images.length).keys()] as id}
        <button
          class="carousel-indicator"
          on:click={() => {
            index = id
          }}
        >
          <!-- aria-current={index === id ? "carousel" : undefined} -->
          <svg width="10" height="10">
            <circle cx="5" cy="5" r="5" />
          </svg>
        </button>
      {/each}
    </ul>
  {/if}
</div>

<style>
  button {
    background-color: transparent;
    border: none;
  }
  img {
    object-fit: cover;
  }

  button.left,
  button.right {
    color: var(--secondary);
    font-size: 60px;
    position: absolute;
    z-index: 100;
    top: 50%;
    transform: translateY(-50%);
  }
  button.left {
    left: 200px;
    padding: 20px 30px 20px 0;
  }

  button.right {
    right: 200px;
    padding: 20px 0px 20px 30px;
  }
  ul {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
  }

  .carousel-indicator {
    padding: 5px 10px;
  }

  .carousel-indicator:hover circle,
  /* .carousel-indicator[aria-current] circle {
    fill: var(--secondary);
  } */

  circle {
    fill: rgb(195, 195, 195);
    transition: fill 0.1s linear;
  }
  @media only screen and (max-width: 1024px) {
    img {
      aspect-ratio: 8/4;
      width: 600;
      height: 300;
    }
  }
  @media only screen and (max-width: 767px) {
  }
</style>
