<script>
  import forzudoRojo from '$lib/assets/bottles/forzudo-rojo-big.webp'
</script>

<div class="content">
  <div>
    <img src={forzudoRojo} alt="" />
  </div>

  <div class="text">
    <h1>Forzudo Rojo</h1>
    <div class="wrap">
      <div class="info">
        <h2>titulo</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Smag & Duft</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Anbefaling</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Oprindelse</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .info {
    width: 50%;
  }
  h1 {
    text-align: center;
    padding: 20px 10px;
    border-bottom: 2px solid var(--secondary);
  }
  h2 {
    padding: 10px 5px;
  }
  p {
    padding-left: 15px;
  }
  .text {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;

    border-radius: 19px;
  }
  .content {
    padding: 20px 100px;
    color: var(--secondary);
    display: flex;
  }
</style>
