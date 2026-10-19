<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'
  import { onDestroy, onMount } from 'svelte'
  import { SvelteMap } from 'svelte/reactivity'
  import type { PageProps } from './$types'
  import { getVermouth } from '$lib/data/products'
  import {
    trackAddShippingInfo,
    trackBeginCheckout,
    GA_CATEGORY_LABEL_BY_HANDLE,
    GA_MISSING,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    type GaListItem,
  } from '$lib/helpers/analytics'
  import { thumbnailSrcSet } from '$lib/helpers/images'
  import {
    getEligibleVariants,
    getLineItemVariantLabel,
    getVariantImage,
    getVariantImageAltText,
    getVariantPriceDisplay,
  } from '$lib/helpers/product-variants'
  import Checkbox from '$lib/components/form-controls/checkbox.svelte'
  import Form from '$lib/components/form-controls/form.svelte'
  import Input from '$lib/components/form-controls/input.svelte'
  import RadioGroup from '$lib/components/form-controls/radio-group.svelte'
  import { formatPrice } from '$lib/helpers/numbers'
  import QuantitySelector from '$lib/components/form-controls/quantity-selector.svelte'

  const { data, form }: PageProps = $props()
  const { cart, locale, purchasesPaused, region, shippingOptions, shippingPrices } = $derived(data)
  let hasDifferentBillingAddress: 'yes' | 'no' = $state('no')
  let selectedShippingMethodId = $derived(
    cart.shipping_methods?.[0]?.shipping_option_id ?? shippingOptions[0]?.id ?? '',
  )
  const hasCartShippingMethod = $derived(Boolean(cart.shipping_methods?.length))
  const selectedShippingOption = $derived(
    shippingOptions.find(({ id }) => id === selectedShippingMethodId),
  )
  const selectedShippingPrice = $derived(getShippingOptionPrice(selectedShippingOption))
  const displayedShippingTotal = $derived(
    hasCartShippingMethod ? cart.shipping_total : selectedShippingPrice,
  )
  let isSubmitting = $state(false)
  const pendingQuantities = $state<Record<string, number>>({})
  const quantitySubmitting = $state<Record<string, boolean>>({})
  const hasOptimisticQuantity = $derived(
    (cart.items ?? []).some(
      ({ id }) => pendingQuantities[id] !== undefined || quantitySubmitting[id],
    ),
  )
  const quantityTimers = new SvelteMap<HTMLFormElement, ReturnType<typeof setTimeout>>()

  onDestroy(() => {
    for (const timer of quantityTimers.values()) clearTimeout(timer)
  })
  let discountCodeMessage = $state('')
  let discountCodeState = $state<'idle' | 'success' | 'error'>('idle')
  let hasCheckoutRedirected = $state(false)
  const checkoutState = $derived<'idle' | 'processing' | 'redirecting'>(
    hasCheckoutRedirected ? 'redirecting' : isSubmitting ? 'processing' : 'idle',
  )
  const analyticsCurrencyCode = $derived(region.currency_code.toUpperCase())
  const pricedItems = $derived(
    (cart.items ?? []).map((item) => {
      const variant = getProductByHandle(item.product_handle)?.variants?.find(
        ({ id }) => id === item.variant_id,
      )
      const hasPriceContext =
        variant && item.is_tax_inclusive && cart.currency_code === region.currency_code
      const prices = hasPriceContext
        ? getVariantPriceDisplay(variant, region.currency_code, locale)
        : []
      const displayedQuantity = pendingQuantities[item.id] ?? item.quantity
      const quantityPrice = hasPriceContext
        ? getVariantPriceDisplay(variant, region.currency_code, locale, displayedQuantity)[0]
        : undefined
      const displayedUnitPrice =
        displayedQuantity !== item.quantity
          ? (quantityPrice?.unitAmount ?? item.unit_price)
          : item.unit_price
      const appliedQuantity =
        quantityPrice?.unitAmount === displayedUnitPrice
          ? prices.findLast(
              (price) =>
                price.quantity <= displayedQuantity && price.unitAmount === displayedUnitPrice,
            )?.quantity
          : undefined

      return { ...item, prices, appliedQuantity, displayedQuantity, displayedUnitPrice }
    }),
  )
  const displayedCartTotal = $derived(
    hasCartShippingMethod ? cart.total : cart.total + (displayedShippingTotal ?? 0),
  )
  const appliedPromoCodes = $derived(
    cart.promotions?.flatMap(({ code, is_automatic }) => (code && !is_automatic ? [code] : [])) ??
      [],
  )
  const discountCodeFormData = $derived(getDiscountCodeFormData())
  const displayedDiscountCodeMessage = $derived(
    discountCodeMessage || discountCodeFormData?.message || '',
  )
  const displayedDiscountCodeState = $derived(getDisplayedDiscountCodeState())

  type QuantityActionSuccess = { success: true; quantity: number }
  type DiscountCodeActionData = {
    action: 'discountCode'
    discountCode?: string
    message?: string
    success?: true
  }
  type CartItemAnalyticsContext = {
    cartItemId: string
    productHandle?: string
    productTitle?: string
    itemVariant: string
    unitPrice: number
    previousQuantity: number
    productId?: string
  }
  type CategoryHandle = keyof typeof GA_CATEGORY_LABEL_BY_HANDLE

  function getProductByHandle(productHandle?: string | null) {
    if (!productHandle) return null

    return (
      Object.values(data.categories)
        .flat()
        .find(({ handle }) => handle === productHandle) ?? null
    )
  }

  function handleCheckoutResult(result: ActionResult) {
    if (result.type === 'redirect') {
      const shippingTier =
        shippingOptions.find(({ id }) => id === selectedShippingMethodId)?.name ?? ''

      trackAddShippingInfo({
        currency: analyticsCurrencyCode,
        shippingTier,
        items: getCartGaItems(),
      })

      hasCheckoutRedirected = true
    }
    isSubmitting = false
  }

  function getDiscountCodeFormData() {
    return form?.action === 'discountCode' ? (form as DiscountCodeActionData) : null
  }

  function getDisplayedDiscountCodeState() {
    if (discountCodeState !== 'idle') return discountCodeState
    if (!discountCodeFormData) return 'idle'
    if (discountCodeFormData.success) return 'success'

    return 'error'
  }

  function handleDiscountCodeResult(result: ActionResult) {
    if (result.type !== 'success' && result.type !== 'failure') return

    const resultData = result.data as DiscountCodeActionData
    if (resultData.action !== 'discountCode') return

    discountCodeMessage = resultData.message ?? ''
    discountCodeState = result.type === 'success' ? 'success' : 'error'
  }

  function formattedPrice(price: number | undefined) {
    if (price === undefined) return ''
    if (price === 0) return 'Gratis'
    return formatPrice(price, region.currency_code, locale)
  }

  function formattedDiscount(price: number | undefined) {
    if (!price) return ''
    return `-${formattedPrice(price)}`
  }

  function getShippingOptionPrice(option?: { amount?: number | null; id: string }) {
    if (!option) return undefined
    return shippingPrices[option.id] ?? option.amount ?? undefined
  }

  function handleChangeQuantity(e: Event & { currentTarget: HTMLInputElement }) {
    const input = e.currentTarget
    const { form } = input
    if (!form || !input.validity.valid || !Number.isSafeInteger(input.valueAsNumber)) return
    const itemId = String(new FormData(form).get('cart_item_id'))
    pendingQuantities[itemId] = input.valueAsNumber

    clearTimeout(quantityTimers.get(form))
    quantityTimers.set(
      form,
      setTimeout(() => {
        quantityTimers.delete(form)
        if (form.isConnected) form.requestSubmit()
      }, 300),
    )
  }

  function getCategoryHandleByProductHandle(productHandle?: string): CategoryHandle | null {
    if (!productHandle) return null

    for (const categoryHandle of ['red', 'white', 'other', 'packs'] as const) {
      if (data.categories[categoryHandle].some((product) => product.handle === productHandle)) {
        return categoryHandle
      }
    }

    return null
  }

  function toGaItem(context: CartItemAnalyticsContext, quantity: string): GaListItem {
    const handle = context.productHandle
    const staticData = getVermouth(handle)
    const categoryHandle = getCategoryHandleByProductHandle(handle)

    return {
      item_id: context.productId || context.cartItemId || GA_MISSING.itemId,
      item_name: context.productTitle || GA_MISSING.itemName,
      price: String(context.unitPrice),
      item_brand: staticData?.brand || GA_MISSING.itemBrand,
      item_category: categoryHandle
        ? GA_CATEGORY_LABEL_BY_HANDLE[categoryHandle]
        : GA_MISSING.itemCategory,
      item_variant: context.itemVariant,
      quantity,
    }
  }

  function getCartGaItems() {
    return (
      cart?.items?.map((item) =>
        toGaItem(
          {
            cartItemId: item.id,
            previousQuantity: item.quantity,
            productHandle: item.product_handle,
            productId: item.product_id,
            productTitle: item.product_title,
            itemVariant: getLineItemVariantLabel({
              optionValues: item.variant_option_values,
              product: getProductByHandle(item.product_handle),
              sku: item.variant_sku,
              title: item.variant_title,
            }),
            unitPrice: item.unit_price,
          },
          String(item.quantity),
        ),
      ) ?? []
    )
  }

  function getCartItemImage(
    productHandle: string | null | undefined,
    fallbackAltText: string,
    variantSku?: string,
  ) {
    const staticData = getVermouth(productHandle)
    if (!staticData) return null
    const configuredImage = variantSku
      ? getVariantImage({
          fallbackAltText,
          variantSku,
          variantImages: staticData.variantImages,
        })
      : null
    const product = getProductByHandle(productHandle)
    if (!product) return null

    if (configuredImage) return configuredImage
    if (getEligibleVariants(product).length !== 1) return null

    return { altText: fallbackAltText, url: staticData.image }
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

  onMount(() => {
    trackBeginCheckout({
      currency: analyticsCurrencyCode,
      items: getCartGaItems(),
    })

    trackViewCart({
      currency: analyticsCurrencyCode,
      items: getCartGaItems(),
    })
  })
</script>

{#snippet cartSnippet()}
  <ul>
    {#each pricedItems as { product_id, product_handle, product_title, quantity, unit_price, variant_option_values, variant_sku, variant_title, id, prices, appliedQuantity, displayedQuantity, displayedUnitPrice } (id)}
      {@const itemVariant = getLineItemVariantLabel({
        optionValues: variant_option_values,
        product: getProductByHandle(product_handle),
        sku: variant_sku,
        title: variant_title,
      })}
      {@const itemImageAltText = getVariantImageAltText(
        product_title ?? product_handle ?? 'Produkt',
        itemVariant,
      )}
      {@const itemImage = getCartItemImage(product_handle, itemImageAltText, variant_sku)}
      <li
        class="cart-item px-4 py-2 lg:p-5 flex border-b border-black first-of-type:border-t lg:first-of-type:border-t-0"
      >
        <img
          alt={itemImage?.altText ?? itemImageAltText}
          class="size-20 shrink-0 object-cover lg:size-16"
          width="66"
          height="66"
          loading="lazy"
          srcset={itemImage ? thumbnailSrcSet(itemImage.url) : undefined}
          src={itemImage ? `${itemImage.url}/w=186,h=186,fit=cover` : undefined}
        />
        <div class="cart-item-content flex min-w-0 flex-col flex-1 justify-between">
          <div class="cart-item-details min-w-0 flex-1 my-auto pt-6 lg:max-w-80">
            <p class="text-sm font-bold">{product_title}</p>
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
                () => quantitySubmitting[id] ?? false,
                (pending) => {
                  quantitySubmitting[id] = pending
                  if (!pending) {
                    delete pendingQuantities[id]
                  }
                }
              }
              onResult={makeQuantityResultHandler({
                cartItemId: id,
                previousQuantity: quantity,
                productHandle: product_handle,
                productId: product_id,
                productTitle: product_title,
                itemVariant,
                unitPrice: unit_price,
              })}
            >
              <fieldset
                disabled={purchasesPaused || quantitySubmitting[id]}
                aria-busy={quantitySubmitting[id]}
              >
                <input name="cart_item_id" type="hidden" value={id} />
                <QuantitySelector
                  min={1}
                  name="quantity"
                  onchange={handleChangeQuantity}
                  value={displayedQuantity}
                />
              </fieldset>
            </Form>
            <Form
              action="?/deleteItem"
              onResult={makeDeleteResultHandler({
                cartItemId: id,
                previousQuantity: quantity,
                productHandle: product_handle,
                productId: product_id,
                productTitle: product_title,
                itemVariant,
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
    <div class="p-5" data-testid="cart-summary">
      <div class="border-b border-black pb-3 mb-5">
        <Form action="?/applyDiscountCode" onResult={handleDiscountCodeResult}>
          <div class="flex flex-col gap-1">
            <div class="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <div class="relative min-w-0 flex-1">
                <input
                  aria-describedby={displayedDiscountCodeMessage
                    ? 'discount-code-message'
                    : undefined}
                  autocomplete="off"
                  class="peer min-h-14 w-full border-b border-black bg-transparent pt-7 pb-2 text-sm uppercase placeholder:text-transparent focus:outline-none"
                  id="discount-code"
                  name="discount_code"
                  placeholder="Rabatkode"
                  required
                  type="text"
                  value={discountCodeFormData?.discountCode ?? appliedPromoCodes[0] ?? ''}
                />
                <label
                  class="pointer-events-none absolute left-0 top-0 text-sm duration-100 ease-linear peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-black"
                  for="discount-code"
                >
                  Rabatkode
                </label>
              </div>
              <button
                class="btn mt-auto items-center justify-center px-5 py-2 text-sm leading-none"
                type="submit"
              >
                Anvend
              </button>
            </div>
            <p
              class={[
                'min-h-3 text-xs leading-none',
                displayedDiscountCodeMessage ? 'visible' : 'invisible',
                displayedDiscountCodeState === 'error' ? 'text-brand-red' : 'text-brand-blue',
              ]}
              id="discount-code-message"
              role={displayedDiscountCodeState === 'error' ? 'alert' : 'status'}
            >
              {displayedDiscountCodeMessage || 'Rabatkode status'}
            </p>
          </div>
        </Form>
      </div>
      <dl class="flex flex-col gap-5 text-sm font-bold mb-2 lg:mb-0" data-testid="cart-totals">
        <div class="flex justify-between">
          <dt>Subtotal</dt>
          <dd class="shrink-0 whitespace-nowrap">{formattedPrice(cart.item_total)}</dd>
        </div>
        {#if cart.discount_total}
          <div class="flex justify-between text-brand-red">
            <dt>Rabat</dt>
            <dd class="shrink-0 whitespace-nowrap">
              {formattedDiscount(cart.discount_total)}
            </dd>
          </div>
        {/if}
        <div class="flex justify-between">
          <dt>Levering</dt>
          <dd class="shrink-0 whitespace-nowrap">{formattedPrice(displayedShippingTotal)}</dd>
        </div>
        <div class="flex justify-between">
          <dt>I alt</dt>
          <dd class="shrink-0 whitespace-nowrap">{formattedPrice(displayedCartTotal)}</dd>
        </div>
      </dl>
      <p class="text-xs mb-2">Inklusiv {formattedPrice(cart.tax_total)} i afgifter</p>
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
    <div class="flex flex-col gap-4 sm:flex-row sm:*:flex-1 sm:gap-3">
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
    <div class="flex flex-col gap-4 sm:flex-row sm:*:flex-1 sm:gap-3">
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
      <fieldset disabled={purchasesPaused}>
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
              price: formattedPrice(getShippingOptionPrice(option)),
              value: option.id,
            }))}
            bind:selected={selectedShippingMethodId}
            required
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
        <button class="btn" type="submit" disabled={hasOptimisticQuantity}>
          {purchasesPaused ? 'BETALING MIDLERTIDIGT PAUSET' : 'Gå til betaling'}
        </button>
      </fieldset>
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
              <dd>{formattedPrice(cart.total)}</dd>
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
    <div class="w-full max-w-sm px-6 text-center text-white">
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
  .cart-item {
    container: cart-item / inline-size;
  }

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
