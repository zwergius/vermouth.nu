<script lang="ts">
  import Link from '$lib/components/link.svelte'
</script>

<div class="container">
  <div>
    <nav>
      <Link href="/">Hjem</Link>
      <div class="menu">
        <Link href="/list-store">Forhandlere</Link>
        <Link href="/products">Produkter</Link>
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
    justify-content: space-between;
  }
  .container {
    width: 100%;
    position: fixed;
    background-color: var(--primary);
    padding: 20px 100px 0 100px;
  }

  @media only screen and (max-width: 1024px) {
    .container {
      padding: 20px 40px 20px;
    }
    nav {
      gap: 20px;
    }
  }

  @media only screen and (max-width: 767px) {
    .container :global(a) {
      font-size: var(--20px);
    }
    nav {
      gap: 10px;
    }
    .menu {
      gap: 10px;
    }
    .container {
      padding: 20px 15px 20px;
    }
  }
</style>
