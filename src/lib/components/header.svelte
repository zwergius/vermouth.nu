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
    margin-top: 25px;
    background-color: transparent;
    border: none;
    border-radius: 32px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 5px;
    text-decoration: none;
  }
  h3 {
    font-size: 20px;
    color: var(--secondary);
  }

  a:hover h3 {
    color: var(--primary);
  }
  a:hover {
    background-color: var(--secondary);
  }
  .text {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-right: 50px;
    gap: 15px;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: hsl(1, 70%, 80%);
    margin-bottom: 60px;
  }
</style>
