<script lang="ts">
  export let vermouth

  const { name, region, cardImage, country, sizeAndDegrees } = vermouth
</script>

<div class="container">
  <img width="300" height="350" src={cardImage} alt={name} />
  <div class="content">
    <h2>{name}</h2>
    <p class="region">{region}</p>
    <div class="footer">
      <p>{country}</p>
      <p class="sizeAndDegrees">{sizeAndDegrees}</p>
    </div>
  </div>
</div>

<style>
  .container {
    overflow: hidden;
    position: relative;
    border: 2px solid var(--secondary);
    border-radius: 20px;
    padding-bottom: 50px;
    padding: 50px;
  }
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
  }
  p {
    font-size: var(--12px);
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
    transform: translate(0, var(--32px));
    transition: transform 0.15s;
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
