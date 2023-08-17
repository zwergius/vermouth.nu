<script>
  /** @type {import('./$types').PageData} */
  export let data
</script>

<div class="content">
  <div class="image">
    <img src={data.vermouth.image} alt="" />
  </div>
  <div class="container">
    <h1>{data.vermouth.brand}</h1>
    <div class="wrap">
      <div class="info">
        <h2>{data.vermouth.subName}</h2>
        <p>
          {data.vermouth.introtext}
        </p>
      </div>
      <div class="info">
        <h2>Smag & Duft</h2>
        <p>
          {data.vermouth.taste}
        </p>
      </div>
      <div class="info">
        <h2>Anbefaling</h2>
        <p>
          {data.vermouth.recommendation}
        </p>
      </div>
      <div class="info">
        <h2>Oprindelse</h2>
        <p>
          {data.vermouth.origin}
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .image {
    width: 25%;
  }
  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
  }
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
  .container {
    display: flex;
    justify-content: center;
    width: 75%;
    flex-direction: column;

    border-radius: 19px;
  }
  .content {
    padding: 20px 100px;
    color: var(--secondary);
    display: flex;
  }
  @media only screen and (max-width: 1024px) {
    .content {
      padding: 0px 50px 30px 50px;
    }
    .image {
      width: 50%;
    }
    .container {
      width: 50%;
    }
    .wrap {
      display: block;
    }
    .info {
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .content {
      flex-direction: column;
      justify-content: center;
      padding: 0px 10px 30px 10px;
    }
    .image {
      width: 100%;
    }
    .container {
      width: 100%;
    }
  }
</style>
