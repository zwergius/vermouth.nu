<script lang="ts">
  import { fade } from 'svelte/transition'

  export let index: number
  export let image: string
  export let name: string
  export let brand: string
  export let visuel: string
  export let oldactory: string
  export let mund: string
</script>

<!-- <a href="#"> -->
<div in:fade={{ duration: 300, delay: index * 150 }} class="card">
  <img src={image} alt="" />
  <h2>{brand}</h2>

  <h4>{name}</h4>
  <div class="content">
    <h2 class="title">{brand} {name}</h2>
    <p><strong>Visuel:</strong>{visuel}</p>
    <p><strong>Olfactory:</strong>{oldactory}</p>
    <p><strong>Mund:</strong>{mund}</p>
  </div>
</div>

<!-- </a> -->

<style>
  .card {
    margin: auto;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s;
    border: 2px solid var(--secondary);
    border-radius: 20px;
    transition: transform 0.2s ease-in-out;
  }
  img {
    display: block;
    transition: transform 0.2s;
    width: 100%;
  }
  .content {
    background-color: var(--white);
    color: var(--secondary);
    font-size: var(--16x);
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    padding: 16px;
    position: absolute;
    top: 0;
    transform: translate(0, 100%);
    transition: transform 0.2s;
    width: 100%;
    z-index: 1;
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
    .card:hover:before {
      transform: translate(0) scale(2.5);
    }
    .card:hover img {
      transform: scale(1.5) rotateZ(10deg);
      transition: transform 0.2s 0.3s;
    }
    .card:hover .title {
      margin-bottom: 1em;
    }
    .card:hover .content {
      transform: translate(0);
      transition: transform 0.2s 0.3s;
    }
    .card:hover {
      transform: scale(1.03);
    }
  }
</style>
