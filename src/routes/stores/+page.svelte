<script>
  import Link from '$lib/components/link.svelte'
  import SEO from '$lib/components/SEO.svelte'

  const stores = [
    {
      name: 'Deppaneur',
      href: 'https://depanneur.dk',
    },
    {
      name: 'Flindt & Ørsted',
      href: 'https://www.flindtorsted.cafe',
    },
    {
      name: 'Ubbes Vinhandel',
      href: 'https://ubbevin.dk',
    },
    {
      name: 'Vinvetto i Torvehallerne',
      href: 'https://vinveto.dk',
    },
  ]

  const bars = [
    {
      name: 'Bevars',
      href: 'https://www.bevars.dk',
    },
    {
      name: 'Bird',
      href: 'https://birdcph.dk',
    },
    {
      name: 'Cafe Wilders',
      href: 'https://www.cafewilder.dk',
    },
    {
      name: 'Flindt & Ørsted',
      href: 'https://www.flindtorsted.cafe',
    },
    {
      name: 'Gaia Cocktails',
      href: 'http://gaiacocktails.dk',
    },
    {
      name: 'Omegn & Venner',
      href: 'http://omegnogvenner.dk',
    },
  ]
</script>

<SEO
  description="Butikker og barer, hvor du kan finde vores udvalg af Vermouth"
  image="https://vermouth.nu/cdn/shop/files/552A24A2-C31B-4C91-A8B3-5A3C5F5EA8D3_2048x.JPG?v=1615928417"
  imageAlt="Vermouth.NU"
  title="Forhandlere | Vermouth.NU"
/>

<section>
  <div class="container">
    <h2>Her kan du k&oslash;be:</h2>
    <ul>
      {#each stores as { name, href }}
        <li>
          <Link target="_blank" rel="noopener external" {href}
            ><span class="truncate">{name}</span>&#8594;</Link
          >
        </li>
      {/each}
    </ul>
    <h2>Her kan du f&#229; serveret:</h2>
    <ul>
      {#each bars as { name, href }}
        <li>
          <Link target="_blank" rel="noopener external" {href}
            ><span class="truncate">{name}</span>&#8594;</Link
          >
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  h2 {
    font-size: var(--55px);
    color: var(--secondary);
    padding-bottom: 20px;
  }
  .container :global(a) {
    font-size: var(--50px);
    align-items: center;
  }
  li {
    padding-bottom: 40px;
  }
  ul {
    padding-bottom: 20px;
  }
  .container {
    flex-direction: column;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 100px;
    padding-top: 90px;
  }
  section {
    width: 100%;
    padding: 0px 100px;
  }
  .truncate {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  @media only screen and (max-width: 1024px) {
    .container :global(a) {
      font-size: var(--40px);
    }
    section {
      padding: 0px;
    }
    ul {
      width: 100%;
    }
    .container {
      padding: 45px 50px;
    }
  }
  @media only screen and (max-width: 767px) {
    .container :global(a) {
      font-size: var(--35px);
    }
    h2 {
      font-size: var(--40px);
      padding-bottom: 10px;
    }
    li {
      padding-bottom: 30px;
    }
    .container {
      padding: 40px 15px 50px 15px;
    }
  }
</style>
