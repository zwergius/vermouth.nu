<script>
  import Header from "../components/header.svelte"
  import Carrousel from "../components/carrousel.svelte"
</script>

<section>
  <div class="container">
    <Header />
    <section class="main">
      <div class="box-logo">
        <div class="logo">
          <img
            width="1300"
            height="400"
            src="/src/assets/images/v.nu_regular_blue_logo@2x.png"
            alt="logo"
          />
        </div>
      </div>

      <Carrousel />
    </section>
  </div>
</section>
<slot />

<style>
  .main {
    margin-top: 120px;
    padding-bottom: 50px;
    display: flex;
    justify-content: center;
  }

  .logo {
    height: 400px;
    z-index: 10;
    top: -50px;
    position: absolute;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .container {
    background-color: hsl(1, 70%, 80%);
  }
</style>
