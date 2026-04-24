<script lang="ts">
  import type { PageData } from './$types'
  import { formatPrice } from '$lib/helpers/numbers'
  import { onMount } from 'svelte'

  const { data }: { data: PageData } = $props()
  const { cart, order } = $derived(data)
  const locale = data.locale

  onMount(() => {
    // In some cases cart is not refreshed when arriving on this page
    console.log('/orders/', { cart })
    if (cart.completed_at) {
      console.log('onmount + cart.completed_at')
      // invalidate('refresh:cart')
    }
  })
</script>

<section class="content">
  <h1>TAK for din handel!</h1>

  <p>Ordrenummer #{order.display_id}</p>

  <p class="text-base">Du modtager en email med faktura og leveringsdetaljer.</p>

  <h2>Ordreoversigt</h2>

  <div class="lg:max-w-[1068px] mb-6 mx-auto text-sm lg:text-base">
    {#each order.items as item}
      <div class="flex justify-between items-center py-2 border-b border-black">
        <span>{item.product_title} x {item.quantity}</span>
        <span>{formatPrice(item.unit_price * item.quantity, order.currency_code, locale)}</span>
      </div>
    {/each}
    <div class="flex justify-between items-center py-2">
      <span>Levering</span>
      <span
        >{order.shipping_total > 0
          ? formatPrice(order.shipping_total, order.currency_code, locale)
          : 'Gratis'}</span
      >
    </div>
    <div class="flex justify-between items-center mb-3 font-bold">
      <span>Total</span>
      <span>{formatPrice(order.total, order.currency_code, locale)}</span>
    </div>
  </div>

  <p>På gensyn snart :)</p>
</section>
