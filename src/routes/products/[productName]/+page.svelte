<script>
  import SEO from '$lib/components/SEO.svelte'

  export let data
  const { image, intro, name, origin, recommendation, taste, titleName } = data.vermouth
</script>

<SEO description={intro} {image} imageAlt={name} title="{name} | Vermouth.NU" />

<div class="wrapper">
  <div class="image-container">
    <img width="580" height="580" src={image} alt={name} />
  </div>
  <div class="content">
    <h1>{name}</h1>
    <p class="region">
      {origin}
    </p>
    <div class="paragraphs">
      <h3>{titleName}</h3>
      <p data-testid="introText">
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
    font-size: var(--20px);
    padding: 0 0 15px 15px;
  }
  img {
    width: 580px;
    object-fit: cover;
  }
  .image-container {
    position: sticky;
    min-width: 580px;
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
  .wrapper {
    color: var(--secondary);
    justify-content: center;
    display: flex;
    align-items: center;
    padding: 100px 250px;
    gap: 20px;
    width: 100%;
  }
  @media only screen and (max-width: 1024px) {
    .wrapper {
      align-items: center;
      padding: 50px;
      padding-top: 100px;
    }
    img {
      width: 400px;
    }
    .image-container {
      min-width: 350px;
    }
  }
  @media only screen and (max-width: 767px) {
    img {
      width: 100%;
      height: auto;
    }
    p {
      font-size: var(--16px);
    }
    .wrapper {
      flex-direction: column;
      justify-content: center;
      padding: 50px 10px 30px;
    }
  }
</style>
