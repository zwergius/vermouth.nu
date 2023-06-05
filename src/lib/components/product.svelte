<script lang="ts">
  import { fade } from 'svelte/transition'

  export let index: number
  export let image: string
  export let name: string
  export let brand: string
</script>

<!-- <a href="#"> -->
<div in:fade={{ duration: 300, delay: index * 150 }} class="product">
  <img src={image} alt="" />
  <h2>{brand}</h2>
  <h4>{name}</h4>
</div>

<!-- </a> -->

<style>
  .product {
    border: 2px solid var(--secondary);
    border-radius: 20px;
    transition: transform 0.2s ease-in-out;
  }

  img {
    width: 100%;
    object-fit: cover;
    padding: 50px;
  }
  h2 {
    color: var(--secondary);
    text-align: center;
    font-size: var(--25px);
  }
  h4 {
    color: var(--secondary);
    font-size: var(--20px);
    text-align: center;
    margin-bottom: 20px;
  }
  @media (hover: hover) {
    .product:hover {
      transform: scale(1.03);
    }
  }
</style>
