<script lang="ts">
  export let image: string

  export let name: string
</script>

<div class="container">
  <img width="300px" height="350px" src={image} alt={name} />
  <h2>{name}</h2>
</div>

<style>
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
    .container:hover {
      transform: scale(1.03);
    }
  }
</style>
