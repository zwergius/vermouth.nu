<script lang="ts">
  import type { Snippet } from 'svelte'
  import { heroHandheldSrcSet, heroSrcSet, responsiveHeroSrcSet } from '$lib/helpers/images'
  type HeroImage = { desktop: string; tablet?: string; mobile?: string }

  const {
    children,
    images,
    alt = 'Welcome',
  }: {
    children?: Snippet
    images: [HeroImage, ...HeroImage[]]
    alt?: string
  } = $props()

  const image = $derived(images[0])
</script>

<section
  class={image.tablet && image.mobile
    ? 'relative border-b border-black'
    : 'relative aspect-[0.95/1] md:aspect-[2.47/1] border-b border-black'}
>
  {#if image.tablet && image.mobile}
    <picture class="block">
      <source
        media="(min-width: 1024px)"
        srcset={responsiveHeroSrcSet(image.desktop)}
        sizes="100vw"
        width="800"
        height="324"
      />
      <source
        media="(min-width: 768px)"
        srcset={responsiveHeroSrcSet(image.tablet)}
        sizes="100vw"
        width="800"
        height="800"
      />
      <img
        {alt}
        class="responsive-hero-image block h-auto w-full object-contain"
        src="{image.mobile}/w=800"
        srcset={responsiveHeroSrcSet(image.mobile)}
        sizes="100vw"
        width="800"
        height="1422"
        fetchpriority="high"
      />
    </picture>
  {:else}
    <picture class="object-fill">
      <source media="(min-width: 480px)" srcset={heroSrcSet(image.desktop)} sizes="100vw" />
      <img
        {alt}
        class="h-auto w-full object-cover brightness-90"
        src="{image.desktop}/w=400,h=421,fit=cover"
        srcset={heroHandheldSrcSet(image.desktop)}
        sizes="100vw"
        width="390"
        height="410"
        fetchpriority="high"
      />
    </picture>
  {/if}
  {#if children}
    <h1 class="h1 absolute inset-0 flex w-full flex-col justify-center px-4 md:px-7 lg:px-36">
      {@render children()}
    </h1>
  {/if}
</section>

<style>
  @media (max-width: 1023px) {
    .responsive-hero-image {
      max-height: calc(100dvh - var(--header-height) - 1px);
    }
  }
</style>
