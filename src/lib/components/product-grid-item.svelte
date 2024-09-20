<script lang="ts">
  import { slugify } from '$lib/helpers'
  import { productSrcSet } from '$lib/helpers/images'
  export let product: { name: string; image: string; origin: string; titleName: string }
</script>

<li class="grid-item aspect-[0.677/1] px-11 pb-7 pt-6 md:aspect-square md:py-6">
  <a class="flex h-full flex-col items-center" href="/sortiment/{slugify(product.name)}">
    <h3 class="mb-2 whitespace-nowrap text-lg font-bold text-brand-blue md:mb-4">
      {product.name}
    </h3>
    <p class="whitespace-nowrap text-xs">{product.origin}</p>
    <div class="flex flex-1 flex-col relative">
      <img
        alt={product.name}
        class="my-auto w-auto md:max-h-44 lg:max-h-fit"
        loading="lazy"
        srcset={productSrcSet(product.image)}
        src="{product.image}/w=145,h=290,fit=cover"
        sizes="(max-width: 700px) 145px, (max-width: 1000px) 90px, 145px"
        width="145"
        height="290"
      />
      <div class="overlay">
        <p class="btn whitespace-nowrap">LÆS MERE</p>
      </div>
    </div>
    <p class="text-xs">{product.titleName}</p>
  </a>
</li>

<style lang="postcss">
  li.grid-item {
    --rotation-duration: 500ms;
    --filter-delay: 200ms;
    --filter-duration: 300ms;
  }
  img {
    filter: blur(0);
    transition:
      transform var(--rotation-duration) ease-in-out,
      filter var(--filter-duration) ease-in-out;
  }

  .overlay {
    @apply absolute inset-y-0 flex flex-col justify-center left-1/2 -translate-x-1/2;
    opacity: 0;
    transition: opacity var(--filter-duration) ease-in-out;
  }

  @media (hover: hover) {
    li.grid-item:hover img {
      transform: rotate(360deg);
      filter: blur(20px);
      transition:
        transform var(--rotation-duration) ease-in-out,
        filter var(--filter-duration) ease-in-out var(--filter-delay);
    }
    li.grid-item:hover .overlay {
      opacity: 100;
      transition: opacity var(--filter-duration) ease-in-out var(--filter-delay);
    }
  }
</style>
