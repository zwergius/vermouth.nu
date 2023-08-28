<script lang="ts">
  import { fade } from 'svelte/transition'

  export let index: number
  export let image: string
  export let name: string
  export let brand: string
  export let sizeAndDegrees: string | undefined
  export let region: string | undefined
</script>

<div in:fade={{ duration: 300, delay: index * 150 }} class="card">
  <img src={image} alt={name} />
  <div class="content">
    <h2>{brand} {name}</h2>
    <p class="origin">Oprindelse</p>
    <p class="region">{region}</p>
    <div class="footer">
      <p>Spanien</p>
      <p class="sizeAndDegrees">{sizeAndDegrees}</p>
    </div>
  </div>
</div>

<style>
  .sizeAndDegrees {
    text-align: right;
  }
  .origin {
    font-size: var(--13px);
    font-weight: 900;
  }
  h2 {
    padding: 20px 0px;
    color: var(--white);
    text-align: center;
    font-size: var(--25px);
  }
  .card {
    overflow: hidden;
    position: relative;
    border: 2px solid var(--secondary);
    border-radius: 20px;
    padding-bottom: 50px;
  }
  img {
    display: block;
    transition: transform 0.15s;
    width: 100%;
    object-fit: cover;
    padding: 50px;
  }
  .content {
    height: 33%;
    width: 100%;
    left: 0;
    bottom: 0;
    position: absolute;
    padding: 0px 16px 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(0, 52%);
    transition: transform 0.15s;
    font-size: 12px;
    font-weight: 500;
    background-color: var(--blue90);
    color: var(--white);
    gap: 10px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
  @media (hover: hover) {
    .card:hover img {
      transform: scale(1.4) rotateZ(10deg);
    }
    .card:hover .content {
      transform: translate(0, 0);
    }
  }
</style>
