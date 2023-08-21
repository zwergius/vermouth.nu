<script>
  /** @type {import('./$types').PageData} */

  export let data
</script>

<div class="container">
  <div class="wrap">
    <div class="image">
      <img src={data.vermouth.image} alt="" />
    </div>
    <div class="content">
      <h1>{data.vermouth.brand}</h1>

      <div class="paragraphs">
        <h2>{data.vermouth.titleName}</h2>
        <p>
          {data.vermouth.intro}
        </p>
      </div>
      <a class="info" href="#info"> <p>Flere oplysninger</p> </a>
    </div>
  </div>

  <div id="info">
    <h2 class="description">Produkt beskrivelse</h2>
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

<style>
  .description {
    font-size: 30px;
  }
  .info {
    padding-top: 30px;
    text-align: right;
    color: var(--red);
  }
  #info {
    padding: 50px;
    color: var(--secondary);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  #info .paragraphs {
    width: 75%;
  }
  .image {
    width: 25%;
  }
  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
  }
  .paragraphs {
    width: 100%;
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
    font-size: 20px;
    padding-left: 15px;
  }
  .content {
    display: flex;
    justify-content: center;
    width: 50%;
    flex-direction: column;
    border-radius: 19px;
  }
  .wrap {
    padding: 100px;
    color: var(--secondary);
    display: flex;
    justify-content: center;
  }
  @media only screen and (max-width: 1024px) {
    .wrap {
      padding: 50px;
    }
    .image {
      width: 50%;
    }
    .content {
      width: 50%;
    }

    #info {
      padding: 170px 50px 100px;
    }

    #info .paragraphs {
      width: 100%;
    }
    .paragraphs {
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .wrap {
      flex-direction: column;
      justify-content: center;
      padding: 30px 10px;
    }
    #info {
      padding: 30px 10px;
    }
    .image {
      width: 100%;
    }
    .content {
      width: 100%;
    }
  }
</style>
