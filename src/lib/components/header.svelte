<div class="container">
  <div class="header">
    <div class="text">
      <a href="hola">
        <h3>Mærker</h3>
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
    justify-content: flex-end;
    align-items: flex-end;
    margin-right: 50px;
    gap: 15px;
  }

  .container {
    padding: 60px;
    margin-bottom: 30px;
  }

  .header {
    right: 0;
    z-index: 100;
    position: absolute;
    background-color: var(--primary);
  }
  @media only screen and (max-width: 767px) {
    h3 {
      font-size: var(--25px);
    }
    .container {
      padding: 25px;
      margin-bottom: 20px;
    }
    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0px;
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
