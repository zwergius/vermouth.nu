<script lang="ts">
  import { fade } from 'svelte/transition'

  export let image: string
  export let name: string
  export let index: number
</script>

<div in:fade={{ duration: 300, delay: index * 150 }} class="product">
  <img src={image} alt={name} />
  <h1>{name}</h1>
</div>

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
  h1 {
    color: var(--secondary);
    text-align: center;
    font-size: var(--25px);
  }
  @media (hover: hover) {
    .product:hover {
      transform: scale(1.03);
    }
  }
</style>
