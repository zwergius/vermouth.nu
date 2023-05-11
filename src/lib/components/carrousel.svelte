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
          sizes="80vw"
          srcset="{path}, 1200w"
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
      {#each [...Array(images.length).keys()] as id}
        <button
          aria-controls={index === id ? "carousel" : undefined}
          class="carousel-indicator"
          on:click={() => {
            index = id
          }}
        >
          <svg width="50" height="30">
            <circle cx="15" cy="15" r="15" />
          </svg>
        </button>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .carrousel {
    position: relative;
    margin: 100px 0;
    width: 1700px;
    height: 700px;
  }
  .image {
    position: absolute;
    width: 1700px;
    height: 700px;
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
    margin-top: 10px;
    position: absolute;
    left: 100px;
    bottom: -50px;
    transform: translateX(-50%);
    display: flex;
  }

  .carousel-indicator {
    padding: 5px 10px;
  }

  .carousel-indicator:hover circle,
  .carousel-indicator[aria-controls] circle {
    fill: var(--secondary);
  }

  circle {
    fill: rgb(195, 195, 195);
    transition: fill 0.1s linear;
  }
  @media only screen and (max-width: 1024px) {
    .image {
      width: 750px;
      height: 500px;
    }
    .carrousel {
      display: flex;
      justify-content: center;
      margin: 40px 0 150px 0;
      width: 750px;
      height: 500px;
    }

    button.left,
    button.right {
      display: none;
    }
    ul {
      top: 580px;
      left: 50%;
    }
  }
  @media only screen and (max-width: 767px) {
    .image {
      width: 360px;
      height: 300px;
    }
    .carrousel {
      width: 360px;
      height: 300px;
    }
    ul {
      top: 350px;
    }
  }
</style>
