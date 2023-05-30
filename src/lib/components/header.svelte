<div class="container">
  <div class="header">
    <nav>
      <a href="/" class="link selection">Hjem</a>
      <div class="menu">
        <a class="link selection" href="/">Bodegaer</a>
        <a class="link selection" href="/products">Produkt</a>
      </div>
    </nav>
  </div>
</div>

<style>
  .menu {
    width: 100%;
    display: flex;
    gap: 20px;
    justify-content: flex-end;
  }
  a {
    text-decoration: none;
    font-size: var(--30px);
    font-weight: bold;
  }
  .link {
    color: var(--secondary);
    display: block;
    position: relative;
  }
  .selection:before {
    content: '';
    height: 1px;
    width: 100%;
    background-color: var(--red30);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    transition: height 0.2s ease-in-out;
  }
  .selection:hover::before {
    height: 10px;
  }
  nav {
    width: 100%;
    display: flex;
  }
  .container {
    background-color: var(--primary);
    padding: 10px 100px 0 100px;
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
      cursor: pointer;
    }
  }
</style>
