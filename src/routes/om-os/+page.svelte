<script lang="ts">
  import viewport from '$lib/actions/use-viewport-action'
  import Marquee from '$lib/components/marquee.svelte'
  import { heroHandheldSrcSet, heroSrcSet, portraitSrcSet, squareSrcSet } from '$lib/helpers/images'

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

<h1
  class="h1 border-b border-black relative flex aspect-[0.95/1] w-full flex-col justify-center px-7 md:aspect-[2.47/1] lg:px-36"
>
  <picture class="absolute inset-0 -z-10 object-fill">
    <source
      media="(min-width: 480px)"
      srcset={heroSrcSet(
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/bfb03447-2e8a-478c-0bd8-ba1667247500',
      )}
      sizes="100vw"
    />
    <img
      alt="Welcome"
      class="h-full w-auto object-cover"
      src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/bfb03447-2e8a-478c-0bd8-ba1667247500/w=400,h=421,fit=cover"
      srcset={heroHandheldSrcSet(
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/bfb03447-2e8a-478c-0bd8-ba1667247500',
      )}
      sizes="100vw"
      width="390"
      height="410"
    />
  </picture>
  <span>
    VENNERNE SOM<br />
    ELSKER SMAGEN AF<br />
    // VERMOUTH
  </span>
</h1>

<section class="border-b border-black px-11 py-16 text-center lg:text-left">
  <div class="lg:w-7/12">
    <h2 class="text-xs mb-6">OM OS</h2>
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
  </div>
</section>

<ul class="founding-fathers md:grid md:grid-cols-3 border-b border-black">
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
      <span class="text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        >{name}</span
      >
    </li>
  {/each}
</ul>

<Marquee text="OM OS //" theme="red"></Marquee>

<section class="split-content border-b border-black">
  <div class="copy">
    <p class="text-xs mb-6">Sådan vælger vi</p>
    <h2 class="text-2xl mb-11">Vores Vermouth</h2>
    <h3 class="text-sm font-bold mb-4">Vi har en mand i marken</h3>
    <p class="text-sm mb-6">
      Bogstaveligt talt! Med Christian bosat i Spanien har Vermouth.nu en dedikeret mand på jorden,
      der dagligt udforsker og opdager nye vermouth-perler. Hans dybe indsigt i den lokale kultur og
      direkte kontakt med små, autentiske producenter sikrer, at kun de bedste flasker finder vej
      til Danmark. Christian besøger vingårde, deltager i smagninger og taler med producenterne for
      at forstå hver eneste detalje af processen. Derigennem udvælges kun vermouth af højeste
      kvalitet.
    </p>
    <h3 class="text-sm font-bold mb-4">Udelukkende vermouth vi selv kan lide</h3>
    <p class="text-sm mb-6">
      Vi vælger kun de vermouther, som vi selv falder pladask for – flasker, der taler til vores
      smagsløg og passion for drikken. Vi går aldrig på kompromis med kvaliteten eller
      smagsoplevelsen, og hver vermouth, vi importerer, er nøje udvalgt på baggrund af vores egne
      høje krav. Smagningen starter ved os selv; hvis ikke vermouthen formår at imponere os, finder
      den heller ikke sin vej til vores sortiment. På den måde sikrer vi, at hver eneste flaske, vi
      tilbyder, er en smagsoplevelse, vi kan stå inde for.
    </p>
    <h3 class="text-sm font-bold mb-4">Smagen af sommer</h3>
    <p class="text-sm mb-6">
      Vermouth er essensen af sommer – solrige dage, varme aftener og uformelt samvær. Hos
      Vermouth.nu er vi på en mission for at finde de vermouther, der bedst indkapsler denne følelse
      af ubekymret nydelse. Vi vælger flasker, hvor friskhed, lethed og en rigdom af urter skaber en
      smag, der transporterer dig direkte til en spansk terrasse med udsigt over Middelhavet. Hver
      slurk skal minde om en sommerdag fyldt med liv og glæde, og vores udvalg er nøje sammensat for
      at bringe sommerstemning til dig.
    </p>
  </div>
  <div class="portrait-image-wrapper">
    <picture class="object-fill">
      <source
        media="(min-width: 1280px)"
        srcset={portraitSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d3d60012-4235-4e75-db02-9fd01421f100',
        )}
        sizes="50vw"
      />
      <img
        alt="Pouring Carmeleta Orange"
        class="h-full w-auto object-cover"
        src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d3d60012-4235-4e75-db02-9fd01421f100/w=400,h=400,fit=cover"
        srcset={squareSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d3d60012-4235-4e75-db02-9fd01421f100',
        )}
        sizes="100vw"
        width="400"
        height="400"
      />
    </picture>
  </div>
</section>

<style>
  @media (hover: hover) {
    .founding-fathers > li:hover > img {
      @apply opacity-100;
    }
  }
</style>
