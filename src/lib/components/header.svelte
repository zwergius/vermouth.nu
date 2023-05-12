<div class="container">
  <div class="header">
    <div class="text">
      <a href="/">
        <h3>Hjem</h3>
      </a>
      <a href="hola">
        <h3>Bodegaer</h3>
      </a>
      <a href="hola">
        <h3>Producenter</h3>
      </a>
    </div>
  </div>
</div>

<style>
  a {
    background-color: transparent;
    border: none;
    border-radius: 32px;
    height: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 5px;
    text-decoration: none;
  }
  h3 {
    font-size: var(--30px);
    color: var(--secondary);
  }

  .text {
    display: flex;
    margin-right: 100px;
    gap: 15px;
  }

  .container {
    background-color: var(--primary);
    padding: 60px;
  }

  .header {
    right: 0;
    z-index: 100;
    position: absolute;
  }
  @media only screen and (max-width: 1024px) {
    .header {
      left: 0;
      right: none;
    }

    .text {
      margin-right: 0;
      margin-left: 100px;
    }
  }
  @media only screen and (max-width: 767px) {
    h3 {
      font-size: var(--25px);
    }
    .container {
      padding: 25px;
    }
    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 0px;
    }
    .header {
      position: static;
    }
  }
  @media (hover: hover) {
    a:hover h3 {
      color: var(--primary);
    }
    a:hover {
      background-color: var(--secondary);
    }
  }
</style>
