<script lang="ts">
  import viewport from '$lib/actions/use-viewport-action'
  import drinkRecipes from '$lib/data/drinkRecipes'
  import { squareSrcSet } from '$lib/helpers/images'
  import Marquee from '$lib/components/marquee.svelte'

  function onExit(e: CustomEvent) {
    const element = e.currentTarget as HTMLElement
    element.classList.add('recipeHidden')
  }

  function onEnter(e: CustomEvent) {
    const element = e.currentTarget as HTMLElement
    element.classList.remove('recipeHidden')
  }
</script>

<section class="split-content border-b border-black">
  <div class="copy">
    <div class="my-auto flex-1">
      <h1 class="text-xs mb-6">INSPIRATION</h1>
      <p class="mb-6 md:mb-8">
        Gå på opdagelse i et smagsunivers, hvor Vermouth er hovedrollen. Vi lover, at du ikke bliver
        skuffet.
      </p>
    </div>
  </div>

  <div class="md:flex md:items-center lg:p-11 2xl:p-24">
    <img
      alt="Sardino Blanco anretning på en bakke"
      class="h-full w-full"
      src="https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/2ecc64e1-b948-40b1-93a1-83c307b10900/w=400,h=400,fit=co,ver"
      srcset={squareSrcSet(
        'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/2ecc64e1-b948-40b1-93a1-83c307b10900',
      )}
      sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
    />
  </div>
</section>

<Marquee text="DRINKS OPSKRIFTER //" theme="red"></Marquee>

<ul class="drink-recipes grid-layout 2xl:grid-cols-3 border-b border-black">
  {#each drinkRecipes as { name, imageUrl, ingredients } (imageUrl)}
    <li
      class="grid-item"
      use:viewport={{ hiddenClassName: 'recipeHidden' }}
      on:enterViewport={onEnter}
      on:exitViewport={onExit}
    >
      <img
        alt={name}
        class="h-full w-full object-cover transition-opacity absolute inset-0"
        width="400"
        height="400"
        loading="lazy"
        src="{imageUrl}/w=800,h=800,fit=cover"
        srcset={squareSrcSet(imageUrl)}
        sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
      />
      <div class="absolute left-1/2 top-11 xl:top-36 -translate-x-1/2 text-white text-center">
        <figure>
          <figcaption class="text-lg text-white mb-6 lg:mb-11 transition-colors whitespace-nowrap">
            {name}
          </figcaption>
          <ul class="ingredients-list text-sm text-black opacity-0 transition-opacity">
            {#each ingredients as ingredient}
              <li class="mb-4">{ingredient}</li>
            {/each}
          </ul>
        </figure>
      </div>
    </li>
  {/each}
</ul>

<section class="content border-b border-black">
  <h2>VIDSTE DU AT VI TILBYDER</h2>
  <p>
    Vermouth smagninger til både private og firmaer. Den helt rigtige måde at komme igang med
    vermouth på.
  </p>
  <a class="btn" href="/smagninger">BOOK EN SMAGNING</a>
</section>

<style lang="postcss">
  @media (hover: none) {
    .drink-recipes > :global(li:not(.recipeHidden) > img) {
      @apply opacity-0;
    }
    .drink-recipes > :global(li:not(.recipeHidden) .ingredients-list) {
      @apply opacity-100;
    }
    .drink-recipes > :global(li:not(.recipeHidden) figcaption) {
      @apply text-brand-blue;
    }
  }
  @media (hover: hover) {
    .drink-recipes > li:hover > img {
      @apply opacity-0;
    }
    .drink-recipes > li:hover .ingredients-list {
      @apply opacity-100;
    }
    .drink-recipes > li:hover figcaption {
      @apply text-brand-blue;
    }
  }
</style>
