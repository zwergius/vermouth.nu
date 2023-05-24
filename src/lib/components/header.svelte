<div class="container">
  <div class="header">
    <nav>
      <a href="/"> Hjem </a>
      <a href="/"> Bodegaer </a>
      <a href="/product"> Produkt </a>
    </nav>
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
    font-size: var(--30px);
    color: var(--secondary);
    font-weight: bold;
  }

  nav {
    display: flex;
    gap: 15px;
  }

  .container {
    background-color: var(--primary);
    padding: 10px 100px 0 0;
  }

  .header {
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
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
  @media (hover: hover) {
    a:hover {
      color: var(--primary);
      background-color: var(--secondary);
    }
  }
</style>
