<div class="container">
  <div class="header">
    <nav>
      <a href="/">Hjem</a>
      <div class="menu">
        <a href="/">Bodegaer</a>
        <a href="/products">Produkt</a>
      </div>
    </nav>
  </div>
</div>

<style>
  .menu {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  a {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 5px;
    text-decoration: none;
    font-size: var(--30px);
    color: var(--secondary);
    font-weight: bold;
  }

  nav {
    width: 100%;
    display: flex;
    gap: 15px;
  }

  .container {
    background-color: var(--primary);
    padding: 10px 100px 0 100px;
  }

  .header {
    z-index: 100;
    display: flex;
    justify-content: space-between;
  }
  @media only screen and (max-width: 1024px) {
    .header {
      left: 0;
      right: none;
      padding-right: 0;
      padding-left: 100px;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
  @media only screen and (max-width: 767px) {
    a {
      font-size: var(--25px);
    }
    .container {
      padding: 25px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .header {
      padding-left: 0px;
      position: static;
    }
  }
</style>
