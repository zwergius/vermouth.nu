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

<section>
  <div class="container">
    <ul>
      {#each stores as { name, href }}
        <li>
          <Links {href}><span class="truncate">{name}</span> &#8594;</Links>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .container :global(a) {
    font-size: var(--50px);
    justify-content: center;
    align-items: center;
  }

  .truncate {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  li {
    padding-bottom: 60px;
  }
  .container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 100px;
  }
  section {
    width: 100%;
    padding: 100px;
  }

  @media only screen and (max-width: 1024px) {
    .container :global(a) {
      font-size: var(--40px);
      border: none;
    }
    section {
      padding: 0px;
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
      font-size: var(--35px);
    }
    li {
      padding-bottom: 30px;
    }
    .container {
      padding: 0px 15px 50px 15px;
    }
  }
</style>
