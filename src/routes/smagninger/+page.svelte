<script lang="ts">
  import { heroSrcSet, heroHandheldSrcSet, portraitSrcSet, squareSrcSet } from '$lib/helpers/images'
  import Marquee from '$lib/components/marquee.svelte'

  const images = [
    {
      alt: 'Carmeleta Orange bliver skænket i glas',
      imageUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/7226fc15-b797-421a-3e1f-282a35343500',
    },
    {
      alt: 'Christoffer skænker Forzudo Blanco til Vermouth Smagning',
      imageUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/b71eef94-e081-4772-0733-e4e2311d2400',
    },
    {
      alt: 'Deltagere til Vermouth Smagning, som lytter og smager på de gyldne dråber',
      imageUrl:
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/c52d3379-d8aa-4a23-1bec-e682e15cff00',
    },
  ]
</script>

<h1
  class="h1 relative flex aspect-[0.95/1] w-full flex-col justify-center px-7 md:aspect-[2.47/1] lg:px-36"
>
  <picture class="absolute inset-0 -z-10 object-fill">
    <source
      media="(min-width: 480px)"
      srcset={heroSrcSet(
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/46c5feb3-ecaf-427e-6623-26c6d3addd00',
      )}
      sizes="100vw"
    />
    <img
      alt="Welcome"
      class="h-full w-auto object-cover"
      src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/46c5feb3-ecaf-427e-6623-26c6d3addd00/w=400,h=421,fit=cover"
      srcset={heroHandheldSrcSet(
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/46c5feb3-ecaf-427e-6623-26c6d3addd00',
      )}
      sizes="100vw"
      width="390"
      height="410"
    />
  </picture>
  <span>
    Smag Vermouth<br />
    // I Totalt Godt<br />
    Selskab
  </span>
</h1>

<section class="content border-y border-black">
  <h2>ENDNU IKKE FAN AF VERMOUTH?</h2>
  <p>
    .. Måske har du bare ikke mødt den helt rigtige endnu. Fortvivl ikke! Lad os hjælpe dig med at
    opdage og nyde vermouth.
  </p>
</section>

<section class="split-content border-b border-black">
  <div class="copy">
    <p class="text-xs mb-6">Book en</p>
    <h2 class="text-2xl mb-6">Vermouth Smagning</h2>
    <p class="text-xs mb-6">Priser fra 450 DKK pr. person</p>
    <a class="btn mb-12 2xl:mb-24" href="mailto:info@vermouth.nu">SEND FORESPØRGSEL</a>
    <h3 class="text-sm font-bold mb-4">En typisk smagning</h3>
    <p class="text-sm">
      Hos Vermouth.nu inviterer vi til en smagsoplevelse, der forfører dine smagsløg med spansk
      elegance. Vi guider dig på en rejse gennem de komplekse og delikate nuancer af den
      vidunderlige drik. Med indsigt og passion skaber vi en atmosfære, hvor hver dråbe fortæller en
      historie om spansk kultur og tradition. Det er oplevelser, der vækker sanserne og giver en ny
      forståelse for vermouth – et arrangement, du ikke må gå glip af! <br /><br />
      Vi gør en dyd ud af at skabe en unik og fleksibel oplevelse til vores vermouth-smagninger. Uanset
      om I vil afholde smagningen på jeres kontor, en restaurant, eller i vores intime koldkrigsbunker,
      tilpasser vi os jeres ønsker. Vi tager med glæde vores flasker med til jer og sørger for at skabe
      den perfekte ramme for en uforglemmelig aften - eller står for hele setuppet selv.<br /><br />
      Vores smagninger er skræddersyet til jeres niveau og interesse, altid med fokus på afslappet hygge
      og den gode historie bag hver flaske. Vi lover, at det bliver en oplevelse fyldt med viden, grin
      og masser af spansk charme.<br /><br />
      Send os en forespørgsel <a class="underline" href="mailto:info@vermouth.nu">her</a>
      :-)
    </p>
  </div>
  <div class="portrait-image-wrapper">
    <picture class="object-fill">
      <source
        media="(min-width: 1280px)"
        srcset={portraitSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d4fd467e-9b62-4b9f-e65d-91d17ce46e00',
        )}
        type="image/webp"
        sizes="50vw"
      />
      <img
        alt="Pouring Carmeleta Orange"
        class="h-full w-auto object-cover"
        src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d4fd467e-9b62-4b9f-e65d-91d17ce46e00/w=400,h=400,fit=cover"
        srcset={squareSrcSet(
          'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d4fd467e-9b62-4b9f-e65d-91d17ce46e00',
        )}
        sizes="100vw"
        width="400"
        height="400"
      />
    </picture>
  </div>
</section>

<Marquee text="OPDAG VERMOUTH //" theme="red"></Marquee>

<ul class="md:grid md:grid-cols-3">
  {#each images as { alt, imageUrl }}
    <li class="relative aspect-square border-b border-black">
      <img
        {alt}
        class="h-full w-full object-cover"
        width="400"
        height="400"
        loading="lazy"
        src="{imageUrl}/w=800,h=800,fit=cover"
        srcset={squareSrcSet(imageUrl)}
        sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
      />
    </li>
  {/each}
</ul>
