<script lang="ts">
  import { vermouths } from '$lib/data/products'
  import viewport from '$lib/actions/use-viewport-action'
  import { heroHandheldSrcSet, heroSrcSet, squareSrcSet } from '$lib/helpers/images'
  import Marquee from '$lib/components/marquee.svelte'
  import ProductGridItem from '$lib/components/product-grid-item.svelte'
  import Seo from '$lib/components/SEO.svelte'

  const products = [
    vermouths['sardino-rojo'],
    vermouths['forzudo-blanco'],
    vermouths['carmeleta-orange'],
  ]

  const founders = [
    {
      name: 'Christoffer',
      imgUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/c77c1d6b-2534-47a3-9e89-d11fe226d800',
    },
    {
      name: 'Christian',
      imgUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/833e24b8-8f2b-448b-c1c4-b9c8cdf6a300',
    },
    {
      name: 'Thomas',
      imgUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/cf316167-9d07-4a5f-b35f-367b41af4700',
    },
  ]

  function onExit(e: CustomEvent) {
    const img = e.currentTarget as HTMLElement
    img.classList.add('opacity-0')
  }

  function onEnter(e: CustomEvent) {
    const img = e.currentTarget as HTMLElement
    img.classList.remove('opacity-0')
  }
</script>

<Seo
  title="Hjem"
  description="Vermouth // Fra Kikset til Cool"
  image="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d3d60012-4235-4e75-db02-9fd01421f100/public"
  imageAlt="Vermouth.Nu Founders"
/>

<section class="flex flex-col justify-center">
  <h1
    class="h1 border-b border-black relative flex aspect-[0.95/1] w-full flex-col justify-center px-7 md:aspect-[2.47/1] lg:px-36"
  >
    <picture class="absolute inset-0 -z-10 object-fill">
      <source
        media="(min-width: 480px)"
        srcset={heroSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/5de0aefc-364c-4bba-dcd4-0c45ed0c2f00',
        )}
        sizes="100vw"
      />
      <img
        alt="Welcome"
        class="h-full w-auto object-cover"
        src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/5de0aefc-364c-4bba-dcd4-0c45ed0c2f00/w=400,h=421,fit=cover"
        srcset={heroHandheldSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/5de0aefc-364c-4bba-dcd4-0c45ed0c2f00',
        )}
        sizes="100vw"
        width="390"
        height="410"
      />
    </picture>
    <span>
      Vermouth<br />
      // Fra kikset<br />
      Til Cool
    </span>
  </h1>

  <div class="content border-b border-black">
    <h2>ENDNU IKKE FAN AF VERMOUTH?</h2>
    <p class="mb-6">
      .. Måske har du bare ikke mødt den helt rigtige<br />
      endnu. Fortvivl ikke! Lad os hjælpe dig med at<br />
      opdage og nyde vermouth.
    </p>
    <a class="btn" href="/forhandlere">SE HVOR</a>
  </div>

  <Marquee text="VERMOUTH ER FOR ALLE //" theme="red"></Marquee>

  <div class="content border-b border-black">
    <h2>HVILKEN FARVE ER DIN FAVORIT?</h2>
    <p class="mb-6">
      Rojo, Blanco, Orange eller Rosa?<br />
      Vi har det&nbsp;<span class="underline">hele</span>.
    </p>
    <a class="btn" href="/sortiment">SE HELE UDVALGET</a>
  </div>

  <Marquee text="FAVORITTER //" theme="yellow"></Marquee>

  <ul class="grid-layout border-b border-black">
    {#each products as product}
      <ProductGridItem {product} />
    {/each}
  </ul>

  <div class="split-content border-b border-black">
    <div class="copy">
      <div class="my-auto flex-1">
        <h2>INSPIRATION</h2>
        <p class="mb-6 md:mb-8">
          Skift ginen ud:<br />Sådan laver du den perfekte vermouth & tonic og meget mere..
        </p>
        <a class="btn" href="/inspiration">DRINKSOPSKRIFTER</a>
      </div>
    </div>

    <div class="md:flex md:items-center md:p-11">
      <img
        alt="Cocktail & Olives"
        class="h-full w-full"
        src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/9919bc7c-d806-41fa-2af1-98ac6aca7b00/w=400,h=400,fit=cover"
        srcset={squareSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/9919bc7c-d806-41fa-2af1-98ac6aca7b00',
        )}
        sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
      />
    </div>
  </div>

  <Marquee text="HVEM ER VERMOUTH VENNERNE //"></Marquee>

  <div class="border-b border-black px-11 py-16 text-center lg:text-left">
    <div class="lg:w-7/12">
      <h2>OM OS</h2>
      <p class="mb-6 md:mb-8">
        Vermouth.nu er skabt af tre passionerede danske venner, Thomas, Christoffer og Christian,
        der alle blev betaget af Spaniens uforlignelige vermouth-kultur. Inspireret af denne spanske
        livsstil, men frustrerede over det begrænsede udvalg i Danmark, besluttede vi at tage sagen
        i egen hånd.
      </p>
      <p class="mb-6 md:mb-8">
        Med kærlighed til urterne og en drøm om at bringe ægte spansk vermouth til danske hjem,
        importerer vi nu de mest udsøgte flasker, der emmer af spansk charme og passion. ¡Salud!
      </p>
      <a class="btn" href="/om-os">LÆS MERE</a>
    </div>
  </div>

  <ul class="founding-fathers md:grid md:grid-cols-3 border-b border-black">
    {#each founders as { name, imgUrl }}
      <li class="relative aspect-square">
        <img
          alt={name}
          class="h-full w-full object-cover opacity-0 transition-opacity"
          use:viewport
          on:enterViewport={onEnter}
          on:exitViewport={onExit}
          width="400"
          height="400"
          loading="lazy"
          src="{imgUrl}/w=800,h=800,fit=cover"
          srcset={squareSrcSet(imgUrl)}
          sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
        />
        <span
          class="text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
          >{name}</span
        >
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  h2 {
    @apply mb-6 text-xs;
  }
  @media (hover: hover) {
    .founding-fathers > li:hover > img {
      @apply opacity-100;
    }
  }
</style>
