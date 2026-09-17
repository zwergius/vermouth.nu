<script lang="ts">
  import { onMount } from 'svelte'
  import {
    formatQuantityPrice,
    quantityChoices,
    type QuantityPricing,
  } from '$lib/helpers/quantity-pricing'

  const {
    pricing,
    locale,
    quantity,
    onSelect,
    disabled = false,
  }: {
    pricing: QuantityPricing
    locale: string
    quantity?: number
    onSelect?: (quantity: number) => void
    disabled?: boolean
  } = $props()
  const choices = $derived(quantityChoices(pricing))
  const visibleChoices = $derived(
    onSelect ? choices.filter((choice) => choice.quantity > 1) : choices,
  )
  let ready = $state(false)
  onMount(() => {
    ready = true
  })
</script>

{#if choices.length > 1}
  <ul class="quantity-offers" class:interactive={!!onSelect} aria-label="Priser efter antal">
    {#each visibleChoices as choice (choice.quantity)}
      <li>
        {#if onSelect}
          <button
            type="button"
            class="tier-button"
            aria-pressed={quantity === choice.quantity}
            disabled={disabled || !ready}
            onclick={() => onSelect?.(choice.quantity)}
          >
            Køb {choice.quantity} for
            {formatQuantityPrice(choice.unitAmount, pricing.currencyCode, locale)}/stk
          </button>
        {:else}
          <span class="block text-xs"
            >{choice.quantity} {choice.quantity === 1 ? 'flaske' : 'flasker'}</span
          >
          <span class="block whitespace-nowrap font-bold"
            >{formatQuantityPrice(choice.total, pricing.currencyCode, locale)}</span
          >
          {#if choice.isDiscounted}
            <span class="sr-only">Uden mængderabat </span>
            <s class="block whitespace-nowrap text-xs opacity-70"
              >{formatQuantityPrice(choice.comparisonTotal, pricing.currencyCode, locale)}</s
            >
          {/if}
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .quantity-offers {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
  .interactive {
    justify-content: flex-start;
    gap: 0.375rem 0.5rem;
  }
  .quantity-offers:not(.interactive) {
    flex-wrap: nowrap;
    gap: 0.75rem;
    margin-inline: -1.5rem;
    font-size: 0.75rem;
    overflow-x: auto;
    justify-content: safe center;
  }
  .quantity-offers:not(.interactive) > li {
    position: relative;
    flex-shrink: 0;
  }
  .quantity-offers:not(.interactive) > li + li::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: -0.375rem;
    border-inline-start: 1px solid #0b10ac40;
  }
  .tier-button {
    border: 1px solid black;
    color: black;
    border-radius: 999px;
    padding: 0.375rem 0.625rem;
    min-height: 34px;
    font-size: 0.75rem;
    line-height: 1.25;
    font-weight: 700;
  }
  .tier-button[aria-pressed='true'] {
    background: theme('colors.brand-blue');
    border-color: theme('colors.brand-blue');
    color: white;
  }
  @media (pointer: coarse) {
    .tier-button {
      min-height: 44px;
    }
  }
  .tier-button:focus-visible {
    outline: 2px solid theme('colors.brand-blue');
    outline-offset: 3px;
  }
  .tier-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
