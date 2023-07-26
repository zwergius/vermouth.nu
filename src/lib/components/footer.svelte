<div class="container">
  <div>
    <div>
      <p>Ophavsret &#169; 2021,</p>
      <p>Vermouth NU.</p>
      <p>CVR - 40649395</p>
    </div>
  </div>
  <div>
    <div class="right">
      <div class="social-media">
        <p>F&oslash;lg os</p>
        <a href="https://www.instagram.com">
          <p>Ig</p>
        </a>

        <a href="https://es-es.facebook.com">
          <p>Fb</p>
        </a>
      </div>
      <a href="mailto:info@vermouth.nu">
        <p>info@vermouth.nu</p>
      </a>
      <p>Nyhedsbrev</p>
    </div>
  </div>
</div>

<style>
  .social-media a p {
    color: var(--interactive-button);
  }
  .social-media {
    gap: 10px;
    display: flex;
    justify-content: flex-end;
  }

  p {
    font-size: var(--25px);
    font-weight: 900;
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
    p {
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
