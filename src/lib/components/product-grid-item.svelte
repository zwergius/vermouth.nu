<script lang="ts">
  import { productSrcSet } from '$lib/helpers/images'
  export let product: { name: string; image: string; origin: string; titleName: string }
</script>

<li class="grid-item aspect-[0.677/1] px-11 pb-7 pt-6 md:aspect-square md:py-6">
  <a class="flex h-full flex-col items-center" href="/">
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
