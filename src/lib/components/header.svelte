<script lang="ts">
  import Link from '$lib/components/link.svelte'
</script>

<div class="container">
  <div>
    <nav>
      <Link href="/">{'Hjme'}</Link>
      <div class="menu">
        <Link href="/products">{'Bodegaer'}</Link>
        <Link href="/list-store">{'Produkt'}</Link>
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
  .container :global(a) {
    font-size: var(--30px);
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
  }

  @media only screen and (max-width: 767px) {
    .container :global(a) {
      font-size: var(--25px);
    }
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
</style>
