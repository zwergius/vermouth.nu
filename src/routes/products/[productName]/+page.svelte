<script>
  export let data
  let { image, intro, name, origin, recommendation, taste, titleName } = data.vermouth
</script>

<div class="wrap">
  <div class="image-container">
    <img width="330px" height="440px" src={image} alt={name} />
  </div>
  <div class="content">
    <h1>{name}</h1>
    <p class="region">
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
  .image-container {
    position: sticky;
    min-width: 430px;
  }
  .region {
    padding: 0;
    font-style: italic;
    padding-bottom: 30px;
  }
  .content {
    display: flex;
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
      align-items: center;
      padding: 50px;
    }
    .image-container {
      min-width: 320px;
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
  }
</style>
