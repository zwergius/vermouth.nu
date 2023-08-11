<script lang="ts">
  import { fade } from 'svelte/transition'

  export let index: number
  export let image: string
  export let name: string
  export let brand: string
  export let size: string | undefined
  export let region: string | undefined
</script>

<!-- <a href="#"> -->
<div in:fade={{ duration: 300, delay: index * 150 }} class="card">
  <img src={image} alt="" />

  <div class="content">
    <h2 class="title">{brand} {name}</h2>
    <p class="origin"><stronge>Oprindelse</stronge></p>
    <p class="region">{region}</p>
    <div class="footer">
      <p>Spanien</p>
      <p class="size">{size}</p>
    </div>
  </div>
</div>

<!-- </a> -->

<style>
  .footer {
    display: flex;
    justify-content: space-between;
  }
  .region {
    padding-bottom: 5px;
  }
  .size {
    padding-bottom: 5px;
    text-align: right;
  }
  .origin {
    font-size: 13px;
    font-weight: 800;
    padding-bottom: 5px;
  }
  .card {
    margin: auto;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s;
    border: 2px solid var(--secondary);
    border-radius: 20px;
    transition: transform 0.2s ease-in-out;
    padding-bottom: 50px;
  }
  img {
    display: block;
    transition: transform 0.2s;
    width: 100%;
    object-fit: cover;
    padding: 50px;
  }
  .title {
    padding-bottom: 10px;
    color: var(--white);
  }
  .content {
    font-size: 12px;
    font-weight: 500;
    background-color: var(--blue90);
    color: var(--white);
    display: flex;
    flex-direction: column;
    height: 33%;
    justify-content: center;
    left: 0;
    padding: 14px 16px 0 16px;
    position: absolute;
    top: 0;
    transform: translate(0, 256%);
    transition: transform 0.2s;
    width: 100%;
    z-index: 1;
  }
  h2 {
    color: var(--secondary);
    text-align: center;
    font-size: var(--25px);
  }
  @media (hover: hover) {
    .card:hover img {
      transform: scale(1.5) rotateZ(10deg);
      transition: transform 0.2s 0.3s;
    }
    .card:hover .content {
      transform: translate(0, 204%);
      transition: transform 0.2s 0.3s;
    }
    .card:hover {
      transform: scale(1.03);
    }
  }
</style>
