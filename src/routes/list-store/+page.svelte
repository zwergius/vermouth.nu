<script>
  import Links from '$lib/components/link.svelte'

  const stores = [
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres cerditos Restaurante Madrid',
      href: 'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
  ]
</script>

<div class="container">
  <ul>
    {#each stores as { name, href }}
      <li>
        <Links {href}>{name} &#8594;</Links>
      </li>
    {/each}
  </ul>
</div>

<style>
  .container :global(a) {
    font-size: 50px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  li {
    padding: 30px 0;
  }
  .container {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 50px 200px;
  }

  @media only screen and (max-width: 1024px) {
    .container :global(a) {
      font-size: 40px;
      border: none;
    }
    ul {
      width: 100%;
    }

    .container {
      padding: 50px 50px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container :global(a) {
      font-size: 35px;
    }
    li {
      padding: 0 0 30px;
    }
    .container {
      padding: 0px 15px 50px 15px;
    }
  }
</style>
