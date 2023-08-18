<script>
  /** @type {import('./$types').PageData} */
  export let data
</script>

<div class="container">
  <div class="image">
    <img src={data.vermouth.image} alt="" />
  </div>
  <div class="content">
    <h1>{data.vermouth.brand}</h1>
    <div class="wrap">
      <div class="paragraphs">
        <h2>{data.vermouth.titleName}</h2>
        <p>
          {data.vermouth.intro}
        </p>
      </div>
      <div class="paragraphs">
        <h2>Smag & Duft</h2>
        <p>
          {data.vermouth.taste}
        </p>
      </div>
      <div class="paragraphs">
        <h2>Anbefaling</h2>
        <p>
          {data.vermouth.recommendation}
        </p>
      </div>
      <div class="paragraphs">
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
  .paragraphs {
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
  .content {
    display: flex;
    justify-content: center;
    width: 75%;
    flex-direction: column;

    border-radius: 19px;
  }
  .container {
    padding: 20px 100px;
    color: var(--secondary);
    display: flex;
  }
  @media only screen and (max-width: 1024px) {
    .container {
      padding: 0px 50px 30px 50px;
    }
    .image {
      width: 50%;
    }
    .content {
      width: 50%;
    }
    .wrap {
      display: block;
    }
    .paragraphs {
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      flex-direction: column;
      justify-content: center;
      padding: 0px 10px 30px 10px;
    }
    .image {
      width: 100%;
    }
    .content {
      width: 100%;
    }
  }
</style>
