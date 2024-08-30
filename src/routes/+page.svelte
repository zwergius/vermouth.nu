<script lang="ts">
  import Marquee from '$lib/components/marquee.svelte'
  import { vermouths } from '$lib/data/products'
  import viewport from '$lib/actions/use-viewport-action'
  import { heroHandheldSrcSet, heroSrcSet, productSrcSet, squareSrcSet } from '$lib/helpers/images'

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
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/b0ec288d-b87e-4313-1067-c094cf3dd700',
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

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col justify-center">
  <h1
    class="h1 relative flex aspect-[0.95/1] w-full flex-col justify-center px-7 md:aspect-[2.47/1] lg:px-36"
  >
    <picture class="absolute inset-0 -z-10 object-fill">
      <source
        media="(min-width: 480px)"
        srcset={heroSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/5de0aefc-364c-4bba-dcd4-0c45ed0c2f00',
        )}
        type="image/webp"
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

  <div class="content">
    <h2>ENDNU IKKE FAN AF VERMOUTH?</h2>
    <p class="mb-6">
      .. Måske har du bare ikke mødt den helt rigtige<br />
      endnu. Fortvivl ikke! Lad os hjælpe dig med at<br />
      opdage og nyde vermouth.
    </p>
    <a class="btn" href="/">SE HVOR</a>
  </div>

  <Marquee theme="red"
    >VERMOUTH ER FOR ALLE // VERMOUTH ER FOR ALLE // VERMOUTH ER FOR ALLE //</Marquee
  >

  <div class="content">
    <h2>HVILKEN FARVE ER DIN FAVORIT?</h2>
    <p class="mb-6">
      Rojo, Blanco, Orange eller Rosa?<br />
      Vi har det&nbsp;<span class="underline">hele</span>.
    </p>
    <a class="btn" href="/">SE HELE UDVALGET</a>
  </div>

  <Marquee theme="yellow">FAVORITTER // FAVORITTER // FAVORITTER // FAVORITTER //</Marquee>

  <ul class="border-black md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {#each products as product}
      <li
        class="aspect-[0.677/1] border-b border-black px-11 pb-7 pt-6
        md:aspect-square md:py-6 md:first-of-type:border-r md:last-of-type:hidden
        lg:border-r lg:last-of-type:block lg:last-of-type:border-r-0
        2xl:last-of-type:border-r"
      >
        <a class="flex h-full flex-col items-center" href="#">
          <h3 class="mb-2 whitespace-nowrap text-lg font-bold text-brand-blue md:mb-4">
            {product.name}
          </h3>
          <p class="whitespace-nowrap text-xs">{product.origin}</p>
          <div class="flex flex-1 flex-col">
            <img
              alt={product.name}
              class="my-auto w-auto md:max-h-44 lg:max-h-fit"
              loading="lazy"
              src="{product.image}/w=145,h=290,fit=cover"
              srcset={productSrcSet(product.image)}
              sizes="(max-width: 700px) 145px, (max-width: 1000px) 90px, 145px"
              width="145"
              height="290"
            />
          </div>
          <p class="text-xs">{product.titleName}</p>
        </a>
      </li>
    {/each}
  </ul>

  <div class="md:flex md:[&>*]:basis-1/2">
    <div class="px-11 py-16 text-center md:flex md:py-0">
      <div class="my-auto flex-1">
        <h2>INSPIRATION</h2>
        <p class="mb-6 md:mb-8">
          Skift ginen ud:<br />Sådan laver du den perfekte vermouth & tonic og meget mere..
        </p>
        <a class="btn" href="/">DRINKSOPSKRIFTER</a>
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

  <Marquee>HVEM ER VERMOUTH VENNERNE // HVEM ER VERMOUTH VENNERNE //</Marquee>

  <div class="border-b border-black px-11 py-16 text-center lg:w-7/12 lg:text-left">
    <h2>OM OS</h2>
    <p class="mb-6 md:mb-8">
      Vermouth.nu er skabt af tre passionerede danske venner, Thomas, Christoffer og Christian, der
      alle blev betaget af Spaniens uforlignelige vermouth-kultur. Inspireret af denne spanske
      livsstil, men frustrerede over det begrænsede udvalg i Danmark, besluttede vi at tage sagen i
      egen hånd.
    </p>
    <p class="mb-6 md:mb-8">
      Med kærlighed til urterne og en drøm om at bringe ægte spansk vermouth til danske hjem,
      importerer vi nu de mest udsøgte flasker, der emmer af spansk charme og passion. ¡Salud!
    </p>
    <a class="btn" href="/">LÆS MERE</a>
  </div>

  <ul class="founding-fathers md:grid md:grid-cols-3">
    {#each founders as { name, imgUrl }}
      <li class="relative aspect-square border-b border-black">
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

<style>
  h2 {
    @apply mb-6 text-xs;
  }
  .content {
    @apply px-11 py-16 text-center;
  }
  @media (hover: hover) {
    .founding-fathers > li > img:hover {
      @apply opacity-100;
    }
  }
</style>
