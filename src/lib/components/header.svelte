<script lang="ts">
  import Link from '$lib/components/link.svelte'
  const home = [
    {
      size: '',
      name: 'Hjem',
      route: '/',
    },
  ]

  const menu = [
    {
      size: '',
      name: 'Bodegaer',
      route: '/list-store',
    },
    {
      size: '',
      name: 'Produkt',
      route: '/products',
    },
  ]
</script>

<div class="container">
  <div>
    <nav>
      {#each home as { name, route, size }}
        <Link {route} {name} {size} />
      {/each}
      <div class="menu">
        {#each menu as { name, route, size }}
          <Link {route} {name} {size} />
        {/each}
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
