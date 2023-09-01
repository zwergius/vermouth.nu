<div class="container">
  <div>
    <p>&#169; Vermouth NU</p>
    <p>CVR - 40649395</p>
  </div>
  <div class="right">
    <div class="social-media">
      <p>F&oslash;lg os</p>
      <a rel="noopener external" href="https://www.instagram.com">Ig</a>
      <a rel="noopener external" href="https://es-es.facebook.com">Fb</a>
    </div>
    <a href="mailto:info@vermouth.nu">info@vermouth.nu</a>
  </div>
</div>

<style>
  .social-media a {
    color: var(--interactive-button);
  }
  .social-media {
    gap: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .right {
    text-align: right;
  }
  .container {
    flex: 1;
    font-size: var(--25px);
    font-weight: 900;
    line-height: 1.5;
    color: var(--secondary-text-color);
    padding: 10px 100px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background-color: var(--secondary);
  }
  @media only screen and (max-width: 1024px) {
    .container {
      padding: 20px 40px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      font-size: var(--16px);
      padding: 10px 10px;
    }
  }
  @media (hover: hover) {
    a:hover {
      cursor: pointer;
    }
  }
</style>
