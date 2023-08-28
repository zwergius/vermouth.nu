<script>
  /** @type {import('./$types').PageData} */

  export let data
  let { image, intro, name, origin, recommendation, taste, titleName } = data.vermouth
</script>

<div class="wrap">
  <div class="image">
    <img src={image} alt={name} />
  </div>
  <div class="content">
    <h1>{name}</h1>
    <p class="origin">
      {origin}
    </p>
    <div class="paragraphs">
      <h3>{titleName}</h3>
      <p>
        {intro}
      </p>
    </div>
    <div class="paragraphs">
      <h3>Smag & Duft</h3>
      <p>
        {taste}
      </p>
    </div>
    <div class="paragraphs">
      <h3>Anbefaling</h3>
      <p>
        {recommendation}
      </p>
    </div>
  </div>
</div>

<style>
  h3 {
    font-weight: 700;
    padding: 10px 5px;
  }
  p {
    line-height: 30px;
    font-size: 20px;
    padding: 0 0 15px 15px;
  }
  img {
    width: 100%;
    object-fit: cover;
    height: auto;
  }
  .image {
    position: sticky;
    width: 35%;
  }
  .origin {
    padding: 0;
    font-style: italic;
    padding-bottom: 15px;
    padding-left: 5px;
  }
  .content {
    display: flex;
    width: 65%;
    flex-direction: column;
  }
  .wrap {
    color: var(--secondary);
    justify-content: center;
    display: flex;
    padding: 100px 250px;
    gap: 20px;
    width: 100%;
  }
  @media only screen and (max-width: 1024px) {
    .wrap {
      padding: 50px;
    }
    .image {
      width: 40%;
    }
    .content {
      width: 60%;
    }
    img {
      height: 70%;
    }
  }
  @media only screen and (max-width: 767px) {
    p {
      font-size: 16px;
    }
    .wrap {
      flex-direction: column;
      justify-content: center;
      padding: 30px 10px;
    }
    .image {
      width: 100%;
    }
    .content {
      width: 100%;
    }
    img {
      height: 100%;
    }
  }
</style>
