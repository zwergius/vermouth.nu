<script lang="ts">
  import Header from "../components/header.svelte"
  import Carrousel from "../components/carrousel.svelte"
</script>

<div class="container">
  <Header />
  <div class="main">
    <div class="box-logo">
      <div class="logo">
        <img
          width="1300"
          height="400"
          src="/src/assets/logo-home.png"
          alt="logo"
        />
      </div>
    </div>

    <Carrousel />
  </div>
</div>

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
    background-color: var(--primary);
  }
</style>
