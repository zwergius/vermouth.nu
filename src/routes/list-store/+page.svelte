<script>
  import Links from '$lib/components/link.svelte'

  const stores = [
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
    {
      name: 'Tres  cerditos Restaurante Madrid',
      size: '40',
      route:
        'https://www.google.es/maps/place/Palos+de+la+Frontera,+Madrid/@40.4039389,-3.6992133,16z/data=!3m1!4b1!4m6!3m5!1s0xd42262fc21d3803:0x91783e9a241dff74!8m2!3d40.4039957!4d-3.6999529!16s%2Fg%2F120nf699?hl=es&entry=ttu',
    },
  ]
</script>

<div class="container">
  <div class="stores">
    {#each stores as { name, route, size }}
      <div class="links">
        <Links {route} {name} {size} />
        <span>&#10170;</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .stores {
    justify-content: center;
    align-items: center;
  }
  span {
    font-size: 40px;
    color: var(--secondary);
    transition: transform 0.3s ease-in-out;
  }

  .links {
    align-items: center;
    display: flex;
    padding: 30px 0;
  }
  .container {
    display: flex;
    justify-content: space-between;
    padding: 50px 200px;
  }
  @media (hover: hover) {
    .links:hover span {
      transform: translateX(50px);
    }
  }
  @media only screen and (max-width: 1024px) {
    .container {
      padding: 50px 30px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container {
      padding: 50px 5px;
    }
  }
</style>
