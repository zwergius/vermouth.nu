<script lang="ts">
  export let image: string
  export let name: string
  export let brand: string
  export let sizeAndDegrees: string | undefined
  export let region: string | undefined
</script>

<div class="container">
  <img src={image} alt={name} />
  <div class="content">
    <h2>{brand}{name}</h2>
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
  h2 {
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--white);
    font-size: var(--25px);
  }
  img {
    display: block;
    transition: transform 0.15s;
    width: 100%;
    object-fit: cover;
    padding: 50px;
  }
  .content {
    width: 100%;
    left: 0;
    bottom: 0;
    position: absolute;
    padding: 0px 16px 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(0, 33%);
    transition: transform 0.15s;
    font-size: 12px;
    font-weight: 500;
    background-color: var(--blue90);
    color: var(--white);
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
  @media (hover: hover) {
    .container:hover img {
      transform: scale(1.25) rotateZ(10deg);
    }
    .container:hover .content {
      transform: translate(0, 0);
    }
  }
</style>
