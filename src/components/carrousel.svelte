<script lang="ts">
  import { browser } from "$app/environment"

  let index = 0
  let interval
  const images = [
    {
      path: "/src/assets/images/552A24A2-C31B-4C91-A8B3-5A3C5F5EA8D3_970x.webp",
      id: "image1",
      alt: "",
    },
    {
      path: "/src/assets/images/banner-01_970x.webp",
      id: "image2",
      alt: "",
    },
    {
      path: "/src/assets/images/IMG_1689_970x.webp",
      id: "image3",
      alt: "",
    },
  ]
  const next = () => {
    index = (index + 1) % images.length
  }
  let ms = 2000
  $: if (browser) {
    clearInterval(interval)
    interval = window.setInterval(next, ms)
  }
</script>

<ul class="container">
  {#each [images[index]] as { id, path } (index)}
    <li class="image">
      <img width="1200" height="600" {id} src={path} alt={id} />
    </li>
  {/each}
</ul>

<style>
  img {
    object-fit: cover;
  }
  .container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .image {
    flex-shrink: 0;
    scroll-snap-align: center;
  }
</style>
