<div class="container">
  <div>
    <div>
      <div class="social-media">
        <h3>F&oslash;lg os</h3>
        <a href="https://www.instagram.com">
          <h2>Ig</h2>
        </a>

        <a href="https://es-es.facebook.com">
          <h2>Fb</h2>
        </a>
      </div>
      <h3>Ophavsret &#169; 2021,</h3>
      <h3>Vermouth NU.</h3>
      <h3>CVR - 40649395</h3>
    </div>
  </div>
  <div>
    <div class="right">
      <h3>Newsletter</h3>
      <a href="mailto:info@vermouth.nu">
        <h3>info@vermouth.nu</h3>
      </a>
      <h3>Nyhedsbrev</h3>
    </div>
  </div>
</div>

<style>
  a h2 {
    color: var(--interactive-button);
  }
  .social-media {
    gap: 10px;
    display: flex;
  }

  h3 {
    font-size: var(--25px);
    line-height: 1.5;
    color: var(--secondary-text-color);
  }
  .right {
    text-align: right;
  }
  .container {
    padding: 10px 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--secondary);
  }
  @media only screen and (max-width: 1024px) {
    .container {
      padding: 20px 40px;
    }
  }
  @media only screen and (max-width: 767px) {
    h3 {
      font-size: var(--16px);
    }
    .container {
      padding: 30px 10px;
    }
  }
  @media (hover: hover) {
    a:hover {
      cursor: pointer;
    }
  }
</style>
