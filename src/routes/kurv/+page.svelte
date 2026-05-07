<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'
  import { vermouths, type Handle } from '$lib/data/products'
  import {
    GA_CATEGORY_LABEL_BY_HANDLE,
    GA_MISSING,
    trackAddToCart,
    trackRemoveFromCart,
    type GaListItem,
  } from '$lib/helpers/analytics'
  import { thumbnailSrcSet } from '$lib/helpers/images'
  import Checkbox from '$lib/components/form-controls/checkbox.svelte'
  import Form from '$lib/components/form-controls/form.svelte'
  import Input from '$lib/components/form-controls/input.svelte'
  import RadioGroup from '$lib/components/form-controls/radio-group.svelte'
  import { formatPrice } from '$lib/helpers/numbers'
  import QuantitySelector from '$lib/components/form-controls/quantity-selector.svelte'
  import { sdk } from '$lib/medusa'
  import type { HttpTypes } from '@medusajs/types'

  const { data }: PageProps = $props()
  const { cart, locale, region, shippingOptions } = $derived(data)
  const shippingPrices: Record<string, number> = $state({})
  let hasDifferentBillingAddress: 'yes' | 'no' = $state('no')
  let isSubmitting = $state(false)
  let checkoutState = $state<'idle' | 'processing' | 'redirecting'>('idle')
  const analyticsCurrencyCode = $derived(region.currency_code.toUpperCase())

  type QuantityActionSuccess = { success: true; quantity: number }
  type CartItemAnalyticsContext = {
    cartItemId: string
    productHandle?: string
    productTitle?: string
    unitPrice: number
    previousQuantity: number
    productId?: string
  }

  function handleCheckoutResult(result: { type: string }) {
    if (result.type === 'redirect') {
      checkoutState = 'redirecting'
    }
    isSubmitting = false
  }

  $effect(() => {
    if (isSubmitting && checkoutState === 'idle') {
      checkoutState = 'processing'
    } else if (!isSubmitting && checkoutState === 'processing') {
      checkoutState = 'idle'
    }
  })

  function formattedPrice(price: number) {
    if (price === 0) return 'Gratis'
    return formatPrice(price, region.currency_code, locale)
  }

  async function calculateShippingPrices() {
    try {
      if (!cart?.id) throw Error('No cart.id !?')

      const promises: Promise<HttpTypes.StoreShippingOptionResponse>[] = []
      shippingOptions.forEach(({ amount, id, price_type }) => {
        if (price_type === 'flat') {
          shippingPrices[id] = amount
          return
        }
        promises.push(sdk.store.fulfillment.calculate(id, { cart_id: cart?.id, data: {} }))
      })

      if (promises.length) {
        const results = await Promise.allSettled(promises)

        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            const { amount, id } = result.value.shipping_option
            shippingPrices[id] = amount
          }
        })
      }
    } catch (e) {
      console.error(`Could not calculate shipping prices ${e}`)
    }
  }

  function handleChangeQuantity(e: Event & { currentTarget: HTMLInputElement }) {
    const { form } = e.currentTarget
    form?.requestSubmit()
  }

  function getCategoryHandle(color: string): keyof typeof GA_CATEGORY_LABEL_BY_HANDLE {
    if (color === 'RED') return 'red'
    if (color === 'WHITE') return 'white'
    return 'other'
  }

  function toGaItem(context: CartItemAnalyticsContext, quantity: string): GaListItem {
    const handle = context.productHandle
    const staticData = handle && handle in vermouths ? vermouths[handle as Handle] : null
    const categoryHandle = staticData ? getCategoryHandle(staticData.color) : null

    return {
      item_id: context.productId || context.cartItemId || GA_MISSING.itemId,
      item_name: context.productTitle || GA_MISSING.itemName,
      price: String(context.unitPrice),
      item_brand: staticData?.brand || GA_MISSING.itemBrand,
      item_category: categoryHandle
        ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle]
        : GA_MISSING.itemCategory,
      quantity,
    }
  }

  function makeQuantityResultHandler(context: CartItemAnalyticsContext) {
    return (result: ActionResult) => {
      if (result.type !== 'success') return

      const previousQuantity = context.previousQuantity
      const resultQuantity = (result.data as QuantityActionSuccess).quantity
      const delta = resultQuantity - previousQuantity

      if (delta > 0) {
        trackAddToCart({
          currency: analyticsCurrencyCode,
          item: toGaItem(context, String(delta)),
        })
      }

      if (delta < 0) {
        trackRemoveFromCart({
          currency: analyticsCurrencyCode,
          item: toGaItem(context, String(Math.abs(delta))),
        })
      }
    }
  }

  function makeDeleteResultHandler(context: CartItemAnalyticsContext) {
    return (result: ActionResult) => {
      if (result.type !== 'success') return

      const deletedQuantity = context.previousQuantity

      trackRemoveFromCart({
        currency: analyticsCurrencyCode,
        item: toGaItem(context, String(deletedQuantity)),
      })
    }
  }

  // TODO: recalculate shipping prices on cart item changes.
  onMount(() => {
    calculateShippingPrices()
  })
</script>

{#snippet cartSnippet()}
  <ul>
    {#each cart?.items as { product_id, product_handle, product_title, quantity, unit_price, id } (id)}
      {@const { image } = vermouths[product_handle as Handle]}
      <li
        class="px-4 py-2 lg:p-5 flex border-b border-black first-of-type:border-t lg:first-of-type:border-t-0"
      >
        <img
          alt={product_title}
          class="size-20 lg:size-16 object-cover"
          width="66"
          height="66"
          loading="lazy"
          srcset={thumbnailSrcSet(image)}
          src="{image}/w=186,h=186,fit=cover"
        />
        <div class="flex flex-col flex-1 gap-0 justify-between lg:flex-row lg:gap-0">
          <div class="flex-1 my-auto pt-6 lg:pt-0 lg:px-5 lg:max-w-80">
            <p class="text-sm font-bold">{product_title}</p>
            <dl class="text-xs flex justify-between">
              <dt>1 stk.</dt>
              <dd>{formattedPrice(unit_price)}</dd>
            </dl>
          </div>
          <div class="flex justify-between items-center">
            <Form
              action="?/addOrUpdateItemQuantity"
              onResult={makeQuantityResultHandler({
                cartItemId: id,
                previousQuantity: quantity,
                productHandle: product_handle,
                productId: product_id,
                productTitle: product_title,
                unitPrice: unit_price,
              })}
            >
              <input name="cart_item_id" type="hidden" value={id} />
              <QuantitySelector
                min={1}
                name="quantity"
                onchange={handleChangeQuantity}
                value={quantity}
              />
            </Form>
            <Form
              action="?/deleteItem"
              onResult={makeDeleteResultHandler({
                cartItemId: id,
                previousQuantity: quantity,
                productHandle: product_handle,
                productId: product_id,
                productTitle: product_title,
                unitPrice: unit_price,
              })}
            >
              <input name="cart_item_id" type="hidden" value={id} />
              <button aria-label="Fjern {product_title} fra kurv." class="p-5" type="submit">
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
      </li>
    {/each}
  </ul>
  {#if cart}
    <div class="p-5">
      <dl class="flex flex-col gap-5 text-sm font-bold mb-2 lg:mb-0">
        <div class="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formattedPrice(cart?.item_total)}</dd>
        </div>
        <div class="flex justify-between">
          <dt>Levering</dt>
          <dd>{formattedPrice(cart?.shipping_total)}</dd>
        </div>
        <div class="flex justify-between">
          <dt>I alt</dt>
          <dd>{formattedPrice(cart?.total)}</dd>
        </div>
      </dl>
      <p class="text-xs mb-2">Inklusiv {formattedPrice(cart?.tax_total)} i afgifter</p>
      <div class="flex flex-col gap-2 lg:flex-row lg:gap-5">
        <img
          src="SST_Alkohol.png"
          srcset="SST_Alkohol.png 1x, SST_Alkohol@2x.png 2x, SST_Alkohol@3x.png 3x"
          class="size-32"
          alt=""
        />
        <div class="mt-auto text-xs">
          <p>
            <strong>Du skal være 18 år for at handle</strong><br />
            - Opstår der tvivl om din alder efter bestilling spørger vi om billede-id
          </p>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

{#snippet formAddressFields(addressType: 'billing' | 'shipping')}
  {@const isDeliveryAddress = addressType === 'shipping'}
  {@const prefix = isDeliveryAddress ? '' : 'billing_'}
  {@const address = isDeliveryAddress ? cart?.shipping_address : cart?.billing_address}
  <h2 class="text-sm font-bold mb-4">{isDeliveryAddress ? 'Levering' : 'Fakturering'}</h2>
  <div class="flex flex-col gap-4 mb-12">
    <input name="{prefix}country" type="hidden" value={region.countries?.[0].iso_2} />
    <div class="flex *:flex-1 gap-3">
      <Input
        autocomplete="given-name"
        label="Fornavn"
        name="{prefix}first_name"
        required
        value={address?.first_name}
      />
      <Input
        autocomplete="family-name"
        label="Efternavn"
        name="{prefix}last_name"
        required
        value={address?.last_name}
      />
    </div>
    <Input
      autocomplete="organization"
      label="Firma (Valgfrit)"
      name="{prefix}company"
      value={address?.company}
    />
    <Input
      autocomplete="address-line1"
      label="Adresse"
      name="{prefix}address"
      required
      value={address?.address_1}
    />
    <Input
      autocomplete="address-line2"
      label="Lejlighed, etage osv. (valgfrit)"
      name="{prefix}address_2"
      value={address?.address_2}
    />
    <div class="flex *:flex-1 gap-3">
      <Input
        autocomplete="postal-code"
        label="Postnummer"
        inputmode="numeric"
        maxlength={4}
        minlength={4}
        name="{prefix}postal_code"
        pattern="\d*"
        required
        type="text"
        value={address?.postal_code}
      />
      <Input
        autocomplete="address-level2"
        label="By"
        name="{prefix}city"
        required
        value={address?.city}
      />
    </div>
    <Input
      autocomplete="tel"
      label="Telefonnummer"
      minlength={8}
      name="{prefix}phone"
      pattern="(\+)?\d*"
      required
      type="tel"
      value={address?.phone}
    />
    {#if isDeliveryAddress}
      <Checkbox
        checked={!!cart?.metadata?.accepts_exclusive_offers}
        label="Send sms-beskeder til mig med ekslusive tilbud"
        name="accepts_exclusive_offers"
      />
    {/if}
  </div>
{/snippet}

<section class="split-content">
  <div class="px-4 py-8 lg:copy">
    <h1 class="text-sm font-bold mb-4">Kontaktinformation</h1>
    <Form action="?/checkout" bind:isSubmitting onResult={handleCheckoutResult}>
      <div class="flex flex-col gap-4 mb-12">
        <Input
          autocomplete="email"
          label="E-mailadresse"
          name="email"
          required
          type="email"
          value={cart.email}
        />
        <Checkbox
          checked={!!cart?.metadata?.accepts_newsletter}
          label="Tilmeld dig vores nyhedsbrev"
          name="acceptsNewsletter"
        />
      </div>
      {@render formAddressFields('shipping')}
      <div class="mb-12">
        <RadioGroup
          groupLabel="Faktureringsadresse"
          name="different_billing_address"
          options={[
            { label: 'Samme addresse som leveringsadresse', value: 'no' },
            { label: 'Brug en anden faktureringsadresse', value: 'yes' },
          ]}
          bind:selected={hasDifferentBillingAddress}
          required
        />
      </div>
      {#if hasDifferentBillingAddress === 'yes'}
        {@render formAddressFields('billing')}
      {/if}
      <div class="mb-12">
        <RadioGroup
          groupLabel="Leveringsmetode"
          name="shipping_method_id"
          options={shippingOptions.map((option) => ({
            description: option.type.description,
            label: option.name,
            price: formattedPrice(shippingPrices[option.id]),
            value: option.id,
          }))}
          required
          selected={cart.shipping_methods?.[0]?.shipping_option_id}
        />
      </div>
      <h2 class="text-sm font-bold mb-4">Bekræft betingelser</h2>
      <div class="flex flex-col gap-4 mb-12">
        <Checkbox
          checked={!!cart?.metadata?.accepts_terms}
          label="Jeg accepterer handelsbetingelserne samt bekræfter, at jeg er over 18 år."
          name="accepts_terms"
          required
          requiredErrorMessage="Du skal bekræfte handelsbetingelser for at fortsætte."
        />
      </div>
      <button class="btn" type="submit">Gå til betaling</button>
    </Form>
  </div>
  <div
    class="basis-1/2 border-black border-b mb-auto lg:border-l lg:sticky lg:top-[var(--header-height)]"
  >
    <div class="hidden lg:block">
      {@render cartSnippet()}
    </div>
    {#if cart}
      <details class="lg:hidden" open>
        <summary class="bg-black/5 text-sm font-bold list-none px-4 py-8">
          <dl>
            <div class="flex justify-between">
              <dt class="flex gap-4 items-center">
                <span>Ordreoversigt</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="currentColor" />
                </svg>
              </dt>
              <dd>{formattedPrice(cart?.total)}</dd>
            </div>
          </dl>
        </summary>
        {@render cartSnippet()}
      </details>
    {/if}
  </div>
</section>

{#if checkoutState !== 'idle'}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300"
    role="status"
  >
    <div class="text-center text-white">
      {#if checkoutState === 'processing'}
        <div class="mb-4 text-lg font-bold">Behandler din ordre...</div>
        <div class="text-sm opacity-80">Vent venligst</div>
      {:else if checkoutState === 'redirecting'}
        <div class="mb-4 text-lg font-bold">Omdirigerer til betaling...</div>
        <div class="text-sm opacity-80">Du bliver sendt videre om et øjeblik</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  details {
    overflow: hidden;

    &::details-content {
      block-size: 0;
      transition: block-size 300ms ease;
    }

    & .icon {
      transform: rotate(-90deg);
      transition: transform 200ms ease;
    }

    &[open] {
      &::details-content {
        block-size: auto;
      }
      .icon {
        transform: rotate(0);
      }
    }
  }
</style>
