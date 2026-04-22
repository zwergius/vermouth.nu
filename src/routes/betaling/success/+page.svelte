<script lang="ts">
  import type { PageData } from './$types'
  import { sdk } from '$lib/medusa'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import type { HttpTypes } from '@medusajs/types'

  const { data }: { data: PageData } = $props()

  // Extend StoreCart type to include order when fetched with *order.id fields
  type CartWithOrder = HttpTypes.StoreCart & {
    order?: { id: string }
  }

  // Reactive state for polling status - only 'loading' or 'error' since success redirects away
  let status = $state<'loading' | 'error'>('loading')

  onMount(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // Start client-side polling
    const poll = async () => {
      const delays = [200, 400, 600, 800, 1000]
      const startTime = Date.now()
      const maxDuration = 5000 // 5 seconds total

      for (const delay of delays) {
        // Check if we've exceeded max duration
        if (Date.now() - startTime >= maxDuration) {
          break
        }

        // Store timeout ID so we can clear it on cleanup
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, delay)
        })

        try {
          const result = await sdk.store.cart.retrieve(data.cartId, {
            fields: '+order.id',
          })
          const cartWithOrder = result.cart as CartWithOrder

          if (cartWithOrder.completed_at && cartWithOrder.order?.id) {
            // Success! Navigate to order page (no success state shown)
            await goto(`/orders/${cartWithOrder.order.id}`)
            return
          }
        } catch (e) {
          console.error('Polling error:', e)
        }
      }

      // Polling completed without success
      status = 'error'
    }

    poll()

    // Cleanup function - clear any pending timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  })
</script>

<svelte:head>
  <!--
    COMMENTED OUT: Meta refresh causes browser timer to fire even after successful navigation.
    The timer starts when HTML is parsed, before JS can remove the tag during hydration.
    This leads to redirect to ?timeout=true and then /betaling/fejl after successful order.
    
    TODO: Investigate alternative no-JS fallback approach.
    
    {#if !browser}
      <meta http-equiv="refresh" content="5;url=/betaling/success?timeout=true" />
    {/if}
  -->
</svelte:head>

<section class="content">
  {#if status === 'loading'}
    <div class="text-center flex flex-col gap-6">
      <p class="text-lg font-bold">Bekræfter din ordre...</p>
      <p class="text-sm opacity-80">Vent venligst</p>
    </div>
  {:else if status === 'error'}
    <div class="text-center flex flex-col gap-6">
      <h1 class="text-2xl">Hovsa!</h1>
      <p>Vi kunne ikke bekræfte din ordre.</p>
      <p>Kontakt os venligst👇👇</p>
    </div>
  {/if}
</section>
