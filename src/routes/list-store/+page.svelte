<script>
  import Links from '$lib/components/link.svelte'

  const stores = [
    {
      name: 'Vinvetto i Torvehallerne',
      href: 'https://www.google.es/maps/place/Vinveto/@55.6843847,12.5669551,17.46z/data=!4m6!3m5!1s0x4652533f332b2c8b:0x12de88491b375343!8m2!3d55.6836436!4d12.5695507!16s%2Fg%2F11fht90tlk?entry=ttu',
    },
    {
      name: 'Ubbes Vinhandel',
      href: 'https://www.google.es/maps/place/Ubbe%C2%B4s+Vinhandel+%2F+wine+bar/@55.6746841,12.5738919,17z/data=!3m1!4b1!4m6!3m5!1s0x46525313f38e34dd:0xcedffc54801f7734!8m2!3d55.6746841!4d12.5764668!16s%2Fg%2F1hc841gqm?entry=ttu',
    },
    {
      name: 'Flindt & Ørsted',
      href: 'https://www.google.es/maps/place/Flindt+%26+%C3%98rsted/@55.6825036,12.5636479,17z/data=!3m1!4b1!4m6!3m5!1s0x4652530f6fffffff:0xa37a4d23adbbd887!8m2!3d55.6825036!4d12.5662228!16s%2Fg%2F113hmy179?entry=ttu',
    },
  ]

  const bar = [
    {
      name: 'Bevars',
      href: 'https://www.google.es/maps/place/Bevar%E2%80%99s/@55.6884205,12.5593955,17z/data=!3m1!4b1!4m6!3m5!1s0x465253072c7ff84b:0xf8d5f5e314ac7281!8m2!3d55.6884205!4d12.5619704!16s%2Fg%2F1hm2pgrh0?entry=ttu',
    },
    {
      name: 'Bird',
      href: 'https://www.google.es/maps/place/bird/@55.6757905,12.5422387,17z/data=!3m1!4b1!4m6!3m5!1s0x46525333e33e1601:0xc52849dc61fea282!8m2!3d55.6757905!4d12.5448136!16s%2Fg%2F11q2kyq29b?entry=ttu',
    },
    {
      name: 'Omegn & Venner',
      href: 'https://www.google.es/maps/place/Omegn+%26+Venner/@55.6837178,12.566557,17z/data=!3m1!4b1!4m6!3m5!1s0x4652533380d68423:0xea4c08fb4e5cf592!8m2!3d55.6837178!4d12.5691319!16s%2Fg%2F11j_t68y3n?entry=ttu',
    },
    {
      name: 'Flindt & Ørsted',
      href: 'https://www.google.es/maps/place/Flindt+%26+%C3%98rsted/@55.6825036,12.5636479,17z/data=!3m1!4b1!4m6!3m5!1s0x4652530f6fffffff:0xa37a4d23adbbd887!8m2!3d55.6825036!4d12.5662228!16s%2Fg%2F113hmy179?entry=ttu',
    },
    {
      name: 'Gaia Cocktails',
      href: 'https://www.google.es/maps/place/Gaia+Cocktails/@55.678716,12.5649594,17z/data=!3m1!4b1!4m6!3m5!1s0x46525321992fb159:0x27324dd98d4e72d1!8m2!3d55.678716!4d12.5675343!16s%2Fg%2F11swtf2glv?entry=ttu',
    },
    {
      name: 'Cafe Wilders',
      href: 'https://www.google.es/maps/place/Cafe+Wilder/@55.6739744,12.5889624,17z/data=!3m1!4b1!4m6!3m5!1s0x4652533ea10820f5:0xab2d59947a5a74ca!8m2!3d55.6739744!4d12.5915373!16s%2Fg%2F1thl40ms?entry=ttu',
    },
  ]
</script>

<section>
  <div class="container">
    <h2>Her kan du k&oslash;be:</h2>
    <ul>
      {#each stores as { name, href }}
        <li>
          <Links {href}><span class="truncate">{name}</span> &#8594;</Links>
        </li>
      {/each}
    </ul>
    <h2>Her kan du f&#229; serveret:</h2>
    <ul>
      {#each bar as { name, href }}
        <li>
          <Links {href}><span class="truncate">{name}</span> &#8594;</Links>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  h2 {
    font-size: var(--55px);
    color: var(--secondary);
    padding-bottom: 60px;
  }
  .container :global(a) {
    font-size: var(--50px);
    align-items: center;
  }
  .truncate {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  ul {
    width: 50%;
  }
  li {
    padding-bottom: 50px;
  }
  .container {
    flex-direction: column;
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
    h2 {
      font-size: var(--40px);
      padding-bottom: 30px;
    }
    li {
      padding-bottom: 30px;
    }
    .container {
      padding: 0px 15px 50px 15px;
    }
  }
</style>
