<script lang="ts">
  import { fade } from 'svelte/transition'

  export let image: string
  export let index: number
  export let name: string
</script>

<div in:fade={{ duration: 300, delay: index * 150 }} class="product">
  <img width="300px" height="350px" src={image} alt={name} />
  <h2>{name}</h2>
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
  h2 {
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
