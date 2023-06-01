<div class="container">
  <div>
    <nav>
      <a href="/" class="link">Hjem</a>
      <div class="menu">
        <a class="link" href="/">Bodegaer</a>
        <a class="link" href="/products">Produkt</a>
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
  .link {
    text-decoration: none;
    font-size: var(--30px);
    font-weight: bold;
    color: var(--secondary);
    display: block;
    position: relative;
    border-bottom: 1px solid var(--color-selection);
  }
  .link:before {
    content: '';
    height: 10px;
    width: 100%;
    background-color: var(--color-selection);
    position: absolute;
    bottom: 0;
    left: 0;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.2s ease-in-out;
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
    .menu {
      justify-content: flex-start;
    }
    nav {
      gap: 20px;
    }
    .link {
      font-size: var(--25px);
    }
  }

  @media only screen and (max-width: 767px) {
    nav {
      gap: 15px;
    }
    .menu {
      gap: 15px;
    }
    .container {
      padding: 25px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (hover: hover) {
    a:hover {
      cursor: pointer;
    }
    .link:hover::before {
      transform: scaleY(1);
      transform-origin: bottom;
    }
  }
</style>
