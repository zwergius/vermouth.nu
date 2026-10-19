<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'
  import type { HttpTypes } from '@medusajs/types'
  import { onDestroy } from 'svelte'
  import Form from '$lib/components/form-controls/form.svelte'
  import QuantitySelector from '$lib/components/form-controls/quantity-selector.svelte'
  import { formatPrice } from '$lib/helpers/numbers'
  import { getVariantPriceDisplay } from '$lib/helpers/product-variants'

  const {
    itemId,
    productTitle,
    itemVariant,
    quantity: confirmedQuantity,
    unitPrice,
    variant,
    currencyCode,
    locale,
    purchasesPaused,
    onQuantityResult,
    onDeleteResult,
    onPendingChange,
  }: {
    itemId: string
    productTitle?: string
    itemVariant: string
    quantity: number
    unitPrice: number
    variant?: HttpTypes.StoreProductVariant
    currencyCode: string
    locale: string
    purchasesPaused: boolean
    onQuantityResult: (result: ActionResult) => void
    onDeleteResult: (result: ActionResult) => void
    onPendingChange: (pending: boolean) => void
  } = $props()

  // Only a changed saved quantity should reset this row’s optimistic override.
  const savedQuantity = $derived(confirmedQuantity)
  let quantity = $derived(savedQuantity)
  let isSubmitting = $state(false)
  let quantityTimer: ReturnType<typeof setTimeout> | undefined
  const prices = $derived(variant ? getVariantPriceDisplay(variant, currencyCode, locale) : [])
  const quantityPrice = $derived(
    variant ? getVariantPriceDisplay(variant, currencyCode, locale, quantity)[0] : undefined,
  )
  const displayedUnitPrice = $derived(
    quantity !== confirmedQuantity ? (quantityPrice?.unitAmount ?? unitPrice) : unitPrice,
  )
  const appliedQuantity = $derived(
    quantityPrice?.unitAmount === displayedUnitPrice
      ? prices.findLast(
          (price) => price.quantity <= quantity && price.unitAmount === displayedUnitPrice,
        )?.quantity
      : undefined,
  )

  function formattedPrice(amount: number) {
    return amount === 0 ? 'Gratis' : formatPrice(amount, currencyCode, locale)
  }

  function handleChangeQuantity(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget
    const { form } = input
    if (!form || !input.validity.valid || !Number.isSafeInteger(input.valueAsNumber)) return
    quantity = input.valueAsNumber
    onPendingChange(quantity !== confirmedQuantity)
    clearTimeout(quantityTimer)
    quantityTimer = setTimeout(() => {
      if (form.isConnected) form.requestSubmit()
    }, 300)
  }

  onDestroy(() => {
    clearTimeout(quantityTimer)
    onPendingChange(false)
  })
</script>

<div class="cart-item-content flex min-w-0 flex-col flex-1 justify-between">
  <div class="cart-item-details min-w-0 flex-1 my-auto pt-6 lg:max-w-80">
    <p class="text-sm font-bold">{productTitle}</p>
    <p class="text-xs">{itemVariant}</p>
    <ul
      class="text-xs"
      aria-label={prices.length > 1 ? 'Mængdepriser' : 'Stykpris'}
      data-testid="cart-unit-price"
    >
      {#each prices.slice(1).toReversed() as price (price.quantity)}
        <li class:font-bold={appliedQuantity === price.quantity}>
          {#if appliedQuantity === price.quantity}
            <span class="whitespace-nowrap">{formattedPrice(price.unitAmount)}/stk.</span>
            <span class="whitespace-nowrap">v. min {price.quantity}</span>
            <span class="whitespace-nowrap">SPAR {price.savingsPercent}%</span>
          {:else}
            <s class="opacity-70">
              <span class="whitespace-nowrap">{formattedPrice(price.unitAmount)}/stk.</span>
              <span class="whitespace-nowrap">v. min {price.quantity}</span>
              <span class="whitespace-nowrap">SPAR {price.savingsPercent}%</span>
            </s>
          {/if}
        </li>
      {/each}
      <li
        class="whitespace-nowrap"
        class:font-bold={appliedQuantity === undefined || appliedQuantity === 1}
      >
        {#if appliedQuantity !== undefined && appliedQuantity !== 1}
          <s class="opacity-70"
            ><span class="sr-only">Normal stykpris </span>{formattedPrice(
              prices[0].unitAmount,
            )}/stk.</s
          >
        {:else}
          {formattedPrice(displayedUnitPrice)}/stk.
        {/if}
      </li>
    </ul>
  </div>
  <div class="flex shrink-0 justify-between items-center">
    <Form
      action="?/addOrUpdateItemQuantity"
      bind:isSubmitting={
        () => isSubmitting,
        (pending) => {
          isSubmitting = pending
          if (!pending) quantity = confirmedQuantity
          onPendingChange(isSubmitting || quantity !== confirmedQuantity)
        }
      }
      onResult={onQuantityResult}
    >
      <fieldset disabled={purchasesPaused || isSubmitting} aria-busy={isSubmitting}>
        <input name="cart_item_id" type="hidden" value={itemId} />
        <QuantitySelector
          min={1}
          name="quantity"
          onchange={handleChangeQuantity}
          bind:value={quantity}
        />
      </fieldset>
    </Form>
    <Form action="?/deleteItem" onResult={onDeleteResult}>
      <input name="cart_item_id" type="hidden" value={itemId} />
      <button aria-label="Fjern {productTitle} fra kurv." class="p-5" type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </Form>
  </div>
</div>

<style>
  @container cart-item (min-width: 24rem) {
    .cart-item-content {
      flex-direction: row;
      align-items: center;
    }

    .cart-item-details {
      padding-top: 0;
      padding-inline: 0.75rem;
    }
  }
</style>
