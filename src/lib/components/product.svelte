<script lang="ts">
  import { fade } from "svelte/transition"
  type vermouthType = {
    brand: string
    name: string
    image: string
  }
  export let vermouth: vermouthType[]
</script>

<div class="container">
  {#each vermouth as { image, name, brand }, index}
    <div in:fade={{ duration: 300, delay: index * 200 }} class="product">
      <img src={image} alt="" />
      <h2>{brand}</h2>
      <h4>{name}</h4>
    </div>
  {/each}
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .product {
    border: 2px solid var(--secondary);
    border-radius: 20px;
    margin: 30px;
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
