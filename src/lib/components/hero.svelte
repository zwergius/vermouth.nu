<script lang="ts">
  import type { Snippet } from 'svelte'
  import { heroHandheldSrcSet, heroSrcSet } from '$lib/helpers/images'
  const { children, imageUrl }: { children: Snippet; imageUrl: string } = $props()
</script>

<section class="relative aspect-[0.95/1] md:aspect-[2.47/1] border-b border-black">
  <picture class="object-fill">
    <source media="(min-width: 480px)" srcset={heroSrcSet(imageUrl)} sizes="100vw" />
    <img
      alt="Welcome"
      class="h-auto w-full object-cover brightness-90"
      src="{imageUrl}/w=400,h=421,fit=cover"
      srcset={heroHandheldSrcSet(imageUrl)}
      sizes="100vw"
      width="390"
      height="410"
    />
  </picture>
  <h1 class="h1 absolute inset-0 flex w-full flex-col justify-center px-7 lg:px-36">
    {@render children()}
  </h1>
</section>
